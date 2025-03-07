import { decodeBase32IgnorePadding, encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';

import { hash, verify } from '@node-rs/argon2';

export const generateTokenBytes = (length: number = 32) => {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	return bytes;
};

export const generateTokenString = (byteLength: number = 32) => {
	const bytes = generateTokenBytes(byteLength);
	return encodeBase32LowerCaseNoPadding(bytes);
};

export const decodeTokenStringToBytes = (token: string): Uint8Array => {
    return decodeBase32IgnorePadding(token);
}

export const createArgon2id = async (data: string | Buffer): Promise<string> => {
	return await hash(data, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
};

export const verifyArgon2id = async (saved: string, data: string): Promise<boolean> => {
	return await verify(saved, data);
};
