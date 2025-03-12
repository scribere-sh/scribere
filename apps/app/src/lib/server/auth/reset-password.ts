import { createArgon2id, generateTokenString, verifyArgon2id } from './cryptography';
import type { RequestEvent } from '@sveltejs/kit';
import { eq, lt } from 'drizzle-orm';

import { type ResetPasswordProps, sendResetPasswordEmail } from '@scribere/email/resetPassword';

import type { DB } from '$db';
import { passwordResetChallengeTable } from '$db/tables';
import { env } from '$env/dynamic/private';
import { route } from '$routes';

// 1 day
const TIME_TO_EXPIRE_MS = 1000 * 60 * 60 * 24;

export const generateAndSaveResetChallenge = async (
    db: DB,
    event: RequestEvent,
    userId: string
): Promise<{ ref: string; token: string }> => {
    const challengeRef = generateTokenString(12);
    const challengeToken = generateTokenString(32);

    await db.insert(passwordResetChallengeTable).values({
        userId,
        challengeRef,
        challengeToken: await createArgon2id(event, challengeToken),
        expiresAt: new Date(Date.now() + +TIME_TO_EXPIRE_MS)
    });

    return {
        ref: challengeRef,
        token: challengeToken
    };
};

export const validatePasswordResetRefTokenPair = async (
    db: DB,
    event: RequestEvent,
    ref: string,
    token: string
): Promise<boolean> => {
    const [challenge] = await db
        .select({
            challengeToken: passwordResetChallengeTable.challengeToken
        })
        .from(passwordResetChallengeTable)
        .where(eq(passwordResetChallengeTable.challengeRef, ref));

    if (!challenge) return false;

    const isValidToken = await verifyArgon2id(event, challenge.challengeToken, token);

    return isValidToken;
};

export const sendPasswordResetEmail = async (
    db: DB,
    reqURL: URL,
    email: string,
    displayName: string,
    ref: string,
    token: string
) => {
    const resetUrl = reqURL;
    resetUrl.pathname = route('/auth/reset-password');
    resetUrl.searchParams.set('reset_ref', ref);
    resetUrl.searchParams.set('reset_token', token);

    const props: ResetPasswordProps = {
        apiKey: env.RESEND_API_KEY,

        from: {
            email: env.SENDER_EMAIL,
            name: env.SENDER_NAME
        },

        to: {
            name: displayName,
            email: email
        },

        resetUrl: resetUrl.toString()
    };

    try {
        const result = await sendResetPasswordEmail(props);
        console.log({ result });
        const emailRef = result.id;

        await db
            .update(passwordResetChallengeTable)
            .set({
                emailRef
            })
            .where(eq(passwordResetChallengeTable.challengeRef, ref));
    } catch (e: unknown) {
        console.error(e);
        throw e;
    }
};

export const deleteExpiredChallenges = async (db: DB) => {
    await db.delete(passwordResetChallengeTable).where(lt(passwordResetChallengeTable, Date.now()));
};
