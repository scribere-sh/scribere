import { decodeBase32IgnorePadding, encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';

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
};

export const createArgon2id = async (
	event: RequestEvent,
	data: string | Buffer
): Promise<string> => {
	const body = {
		passowrd: data,
		options: {
			timeCost: 2,
			memoryCost: 19456,
			parallelism: 1
		}
	};

	const response = await event.platform!.env.ARGON2.fetch('http://internal/hash', {
		method: 'POST',
		body: JSON.stringify(body)
	});

	const { hash } = (await response.json()) as { hash: string };

	return hash;
};

export const verifyArgon2id = async (
	event: RequestEvent,
	saved: string,
	data: string
): Promise<boolean> => {
	const body = {
		password: data,
		hash: saved
	};

	const response = await event.platform!.env.ARGON2.fetch('http://internal/verify', {
		method: 'POST',
		body: JSON.stringify(body)
	});

	const { matches } = (await response.json()) as { matches: boolean };
	return matches;
};
