import { decodeBase32IgnorePadding, encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

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

export const createArgon2id = async (event: RequestEvent, data: string): Promise<string> => {
	const body = {
		passowrd: data,
		options: {
			timeCost: 2,
			memoryCost: 19456,
			parallelism: 1
		}
	};

	let response;

	if (dev) {
		console.info('Used Remote Argon2');
		response = await event.fetch(`https://${env.DEV_AUTH_ARGON2_DOMAIN}/hash`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'dev-argon2': 'yomama'
			}
		});
	} else {
		response = await event.platform!.env.ARGON2.fetch('http://internal/hash', {
			method: 'POST',
			body: JSON.stringify(body)
		});
	}

	const text = await response.text();

	try {
		const { hash } = JSON.parse(text) as { hash: string };

		return hash;
	} catch (e) {
		console.error(text);

		throw e;
	}
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

	let response;

	if (dev) {
		console.info('Used Remote Argon2');
		response = await event.fetch(`https://${env.DEV_AUTH_ARGON2_DOMAIN}/verify`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'dev-argon2': 'yomama'
			}
		});
	} else {
		response = await event.platform!.env.ARGON2.fetch('http://internal/verify', {
			method: 'POST',
			body: JSON.stringify(body)
		});
	}

	const text = await response.text();

	try {
		const { matches } = JSON.parse(text) as { matches: boolean };
		return matches;
	} catch (e) {
		console.error(text);

		throw e;
	}
};
