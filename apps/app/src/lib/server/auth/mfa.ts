import {
    createArgon2id,
    decodeTokenStringToBytes,
    generateTokenBytes,
    generateTokenString,
    verifyArgon2id
} from './cryptography';
import { encodeBase32UpperCaseNoPadding } from '@oslojs/encoding';
import { createTOTPKeyURI, verifyTOTPWithGracePeriod } from '@oslojs/otp';
import { and, eq } from 'drizzle-orm';

import { getRequestEvent } from '$app/server';
import { type TX } from '$db';
import { twoFactorAuthenticationProviderTable } from '$db/tables';

export const TOTP_TYPE = 'totp';

export const TOTP_RECOVERY_TYPE = 'totp_recovery';

const ISSUER = 'Scribere';
const MFA_PERIOD_SECONDS = 30;
const MFA_DIGITS = 6;
const MFA_GRACE_PERIOD_SECONDS = 10;

// export const generateRecoveryCode = async (userId: string): Promise<string> => {
// 	const recoveryKey = generateTokenString(10);
// 	const hashedRecoveryKey = await createArgon2id(recoveryKey);

// 	await DB.insert(twoFactorAuthenticationProviderTable).values({
// 		userId,
// 		type: TOTP_RECOVERY_TYPE,
// 		challenge: hashedRecoveryKey
// 	});

// 	return recoveryKey;
// };

export const generateTOTPKey = generateTokenString;

export const userHasTOTP = async (userId: string, tx_db?: TX): Promise<boolean> => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    const result = await db
        .select({ type: twoFactorAuthenticationProviderTable.type })
        .from(twoFactorAuthenticationProviderTable)
        .where(
            and(
                eq(twoFactorAuthenticationProviderTable.userId, userId),
                eq(twoFactorAuthenticationProviderTable.type, TOTP_TYPE)
            )
        );

    return result.length > 0;
};

export const generateTOTPEnrollmentURL = (key: string, account_name: string): string => {
    const keyBytes = decodeTokenStringToBytes(key);

    return createTOTPKeyURI(ISSUER, account_name, keyBytes, MFA_PERIOD_SECONDS, MFA_DIGITS);
};

export const verifyOTP = (key: string, digits: string) => {
    const keyBytes = decodeTokenStringToBytes(key);

    return verifyTOTPWithGracePeriod(
        keyBytes,
        MFA_PERIOD_SECONDS,
        MFA_DIGITS,
        digits,
        MFA_GRACE_PERIOD_SECONDS
    );
};

export const enrolUserWithTOTP = async (
    userId: string,
    key: string,
    initial: string,
    tx_db?: TX
): Promise<boolean> => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    if (!verifyOTP(key, initial)) {
        return false;
    }

    await db.insert(twoFactorAuthenticationProviderTable).values({
        userId,
        type: TOTP_TYPE,
        challenge: key
    });

    return true;
};

export const verifyUserOTP = async (
    userId: string,
    digits: string,
    tx_db?: TX
): Promise<boolean> => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    const [otpChallengeLookup] = await db
        .select({
            challenge: twoFactorAuthenticationProviderTable.challenge
        })
        .from(twoFactorAuthenticationProviderTable)
        .where(
            and(
                eq(twoFactorAuthenticationProviderTable.userId, userId),
                eq(twoFactorAuthenticationProviderTable.type, TOTP_TYPE)
            )
        );

    if (!otpChallengeLookup) {
        throw new Error('User not enrolled in TOTP');
    }

    return verifyOTP(otpChallengeLookup.challenge, digits);
};

export const generateMFARecoveryCode = () => encodeBase32UpperCaseNoPadding(generateTokenBytes(16));

export const setRecoveryCodeForUser = async (userId: string, code: string, tx_db?: TX) => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    db.insert(twoFactorAuthenticationProviderTable).values({
        userId,
        type: TOTP_RECOVERY_TYPE,
        challenge: await createArgon2id(code)
    });
};

export const verifyRecoveryCode = async (userId: string, code: string, tx_db?: TX) => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    const [challenge] = await db
        .select({ argon: twoFactorAuthenticationProviderTable.challenge })
        .from(twoFactorAuthenticationProviderTable)
        .where(
            and(
                eq(twoFactorAuthenticationProviderTable.userId, userId),
                eq(twoFactorAuthenticationProviderTable.type, TOTP_RECOVERY_TYPE)
            )
        );

    if (!challenge) return false;

    return await verifyArgon2id(challenge.argon, code);
};

export const resetUserTOTP = async (userId: string, tx_db?: TX) => {
    const { locals } = getRequestEvent();
    const db = tx_db ?? locals.DB;

    await db
        .delete(twoFactorAuthenticationProviderTable)
        .where(
            and(
                eq(twoFactorAuthenticationProviderTable.type, TOTP_TYPE),
                eq(twoFactorAuthenticationProviderTable.userId, userId)
            )
        );

    await db
        .delete(twoFactorAuthenticationProviderTable)
        .where(
            and(
                eq(twoFactorAuthenticationProviderTable.type, TOTP_RECOVERY_TYPE),
                eq(twoFactorAuthenticationProviderTable.userId, userId)
            )
        );
};
