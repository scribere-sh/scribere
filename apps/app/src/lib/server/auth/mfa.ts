import { and, eq } from 'drizzle-orm';
import { DB } from '../db';
import { twoFactorAuthenticationProviderTable } from '../db/tables';

import { createTOTPKeyURI, verifyTOTPWithGracePeriod } from '@oslojs/otp';
import { decodeTokenStringToBytes, generateTokenString } from './cryptography';

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

export const userHasTOTP = async (userId: string): Promise<boolean> => {
	const result = await DB.select({ type: twoFactorAuthenticationProviderTable.type })
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
	initial: string
): Promise<boolean> => {
	if (!verifyOTP(key, initial)) {
		return false;
	}

	await DB.insert(twoFactorAuthenticationProviderTable).values({
		userId,
		type: TOTP_TYPE,
		challenge: key
	});

	return true;
};

export const verifyUserOTP = async (userId: string, digits: string): Promise<boolean> => {
	const [otpChallengeLookup] = await DB.select({
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
