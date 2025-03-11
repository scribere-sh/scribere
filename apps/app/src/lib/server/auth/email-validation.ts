import { createArgon2id, generateTokenString, verifyArgon2id } from './cryptography';
import { encodeHexLowerCase } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { sendValidationEmail, type ValidateEmailProps } from '@scribere/email/validateEmail';

import { type DB } from '$db';
import { emailAddressTable, emailValidationChallengeTable } from '$db/tables';
import { env } from '$env/dynamic/private';
import { route } from '$routes';

export const generateChallengeRef = (emailAddress: string) =>
    encodeHexLowerCase(new TextEncoder().encode(emailAddress));
export const generateChallengeToken = generateTokenString;

export interface EmailAddressChallenge {
    ref: string;
    token: string;
}

/**
 * generate an email validation challenge
 *
 * @param emailAddress The email address to verify and challenge
 */
export const generateEmailValidation = async (
    db: DB,
    event: RequestEvent,
    emailAddress: string
): Promise<EmailAddressChallenge> => {
    const challengeRef = generateChallengeRef(emailAddress);
    const challengeToken = generateChallengeToken();

    const challengeTokenArgon2id = await createArgon2id(event, challengeToken);

    await db.insert(emailValidationChallengeTable).values({
        challengeRef,
        challengeTokenHash: challengeTokenArgon2id
    });

    await db
        .update(emailAddressTable)
        .set({ challengeRef })
        .where(eq(emailAddressTable.emailAddress, emailAddress));

    return {
        ref: challengeRef,
        token: challengeToken
    };
};

/**
 * send an email validation challenge
 */
export const sendEmailValidationChallenge = async (
    db: DB,
    displayName: string,
    emailAddress: string,
    reqUrl: URL,
    challenge: EmailAddressChallenge
) => {
    const validationUrl = reqUrl;
    validationUrl.pathname = route('GET /auth/verify-email');
    validationUrl.searchParams.set('validation_reference', challenge.ref);
    validationUrl.searchParams.set('token', challenge.token);

    const props: ValidateEmailProps = {
        apiKey: env.RESEND_API_KEY,

        from: {
            email: env.SENDER_EMAIL,
            name: env.SENDER_NAME
        },
        to: {
            name: displayName,
            email: emailAddress
        },

        validationUrl: validationUrl.toString()
    };

    try {
        const result = await sendValidationEmail(props);
        const emailRef = result.id;

        await db
            .update(emailValidationChallengeTable)
            .set({
                emailRef
            })
            .where(eq(emailValidationChallengeTable.challengeRef, challenge.ref));
    } catch (e: unknown) {
        console.log(e);
        throw e;
    }
};

export const verifyEmailValidationRequest = async (db: DB, event: RequestEvent) => {
    const challengeRef = event.url.searchParams.get('ref');
    const challengeToken = event.url.searchParams.get('token');

    if (!challengeRef || !challengeToken) {
        throw new Error('Validation Challenge ref and/or token not specified');
    }

    const [challenge] = await db
        .select({
            challengeToken: emailValidationChallengeTable.challengeTokenHash
        })
        .from(emailValidationChallengeTable)
        .where(eq(emailValidationChallengeTable.challengeRef, challengeRef));

    if (await verifyArgon2id(event, challenge.challengeToken, challengeToken)) {
        await db
            .delete(emailValidationChallengeTable)
            .where(eq(emailValidationChallengeTable.challengeRef, challengeRef));

        await db
            .update(emailAddressTable)
            .set({
                challengeRef: null,
                isValidated: true
            })
            .where(eq(emailAddressTable.challengeRef, challengeRef));
    } else {
        throw new Error('Email validation challenge failed');
    }
};
