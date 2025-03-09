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

	const fetchFn = dev ? event.fetch : event.platform!.env.ARGON2.fetch;
	const fetchUrl = dev ? `https://${env.DEV_AUTH_ARGON2_DOMAIN}/hash` : 'http://internal/hash';

    if ( dev ) console.info('Used Remote Argon2');

	const response = await fetchFn(fetchUrl, {
		method: 'POST',
		body: JSON.stringify(body),
        headers: dev ? {
            "dev-argon2": "yomama"
        } : undefined
	});

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

	const fetchFn = dev ? event.fetch : event.platform!.env.ARGON2.fetch;
	const fetchUrl = dev
		? `https://${env.DEV_AUTH_ARGON2_DOMAIN}/verify`
		: 'http://internal/verify';

    if ( dev ) console.info('Used Remote Argon2');

	const response = await fetchFn(fetchUrl, {
		method: 'POST',
		body: JSON.stringify(body),
        headers: dev ? {
            "dev-argon2": "yomama"
        } : undefined
	});

	const text = await response.text();

	try {
		const { matches } = JSON.parse(text) as { matches: boolean };
		return matches;
	} catch (e) {
		console.error(text);

		throw e;
	}
};
