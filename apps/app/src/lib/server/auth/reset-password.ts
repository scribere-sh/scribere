import { createArgon2id, generateTokenString, verifyArgon2id } from './cryptography';
import { eq, lte } from 'drizzle-orm';

import { type ResetPasswordProps, sendResetPasswordEmail } from '@scribere/email/resetPassword';

import { getRequestEvent } from '$app/server';
import { type TX } from '$db';
import { passwordResetChallengeTable } from '$db/tables';
import { env } from '$env/dynamic/private';
import { route } from '$routes';

// 1 day
const TIME_TO_EXPIRE_MS = 1000 * 60 * 60 * 24;

export const generateAndSaveResetChallenge = async (
    userId: string,
    tx_db?: TX
): Promise<{ ref: string; token: string }> => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    const challengeRef = generateTokenString(12);
    const challengeToken = generateTokenString(32);

    await db.insert(passwordResetChallengeTable).values({
        userId,
        challengeRef,
        challengeToken: await createArgon2id(challengeToken),
        expiresAt: new Date(Date.now() + +TIME_TO_EXPIRE_MS)
    });

    return {
        ref: challengeRef,
        token: challengeToken
    };
};

export const validatePasswordResetRefTokenPair = async (
    ref: string,
    token: string,
    tx_db?: TX
): Promise<boolean> => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    const [challenge] = await db
        .select({
            challengeToken: passwordResetChallengeTable.challengeToken
        })
        .from(passwordResetChallengeTable)
        .where(eq(passwordResetChallengeTable.challengeRef, ref));

    if (!challenge) return false;

    const isValidToken = await verifyArgon2id(challenge.challengeToken, token);

    return isValidToken;
};

export const sendPasswordResetEmail = async (
    email: string,
    displayName: string,
    ref: string,
    token: string,

    tx_db?: TX
) => {
    const { locals, url } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    const resetUrl = url;
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

export const deleteExpiredChallenges = async (tx_db?: TX) => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    await db
        .delete(passwordResetChallengeTable)
        .where(lte(passwordResetChallengeTable.expiresAt, new Date()));
};
