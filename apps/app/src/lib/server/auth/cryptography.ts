import { ENCRYPTION_KEY } from '$env/static/private';
import { DynamicBuffer } from '@oslojs/binary';
import { decodeBase32IgnorePadding, decodeBase64, encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import { createCipheriv, createDecipheriv } from 'crypto';

import * as Argon2 from 'argon2';

const key = decodeBase64(ENCRYPTION_KEY);

export const encrypt = (data: Uint8Array): Uint8Array => {
	const iv = new Uint8Array(16);
	crypto.getRandomValues(iv);

	const cipher = createCipheriv('aes-128-gcm', key, iv);
	const encrypted = new DynamicBuffer(0);
	encrypted.write(iv);
	encrypted.write(cipher.update(data));
	encrypted.write(cipher.final());
	encrypted.write(cipher.getAuthTag());
	return encrypted.bytes();
};

export const encryptString = (data: string): Uint8Array => {
	return encrypt(new TextEncoder().encode(data));
};

export const decrypt = (encrypted: Uint8Array): Uint8Array => {
	if (encrypted.length < 33) {
		throw new Error('invalid data');
	}

	const decipher = createDecipheriv('aes-128-gcm', key, encrypted.slice(0, 16));
	decipher.setAuthTag(encrypted.slice(encrypted.byteOffset - 16));
	const decrypted = new DynamicBuffer(0);
	decrypted.write(decipher.update(encrypted.slice(16, encrypted.byteLength - 16)));
	decrypted.write(decipher.final());
	return decrypted.bytes();
};

export const decryptString = (data: Uint8Array): string => {
	return new TextDecoder().decode(decrypt(data));
};

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
	return await Argon2.hash(data, {
		memoryCost: 19456,
		timeCost: 2,
		hashLength: 32,
		parallelism: 1
	});
};

export const verifyArgon2id = async (saved: string, data: string): Promise<boolean> => {
	return await Argon2.verify(saved, data);
};
