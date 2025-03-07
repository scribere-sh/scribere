import { TRPC_PATH } from '$lib/client/trpc';
import {
	deleteSessionToken,
	SESSION_TOKEN_NAME,
	setSessionToken,
	validateSessionToken
} from '$lib/server/auth/session';
import { createContext } from '$lib/server/trpc/context';
import { router } from '$lib/server/trpc/router';

import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { createTRPCHandle } from 'trpc-sveltekit';

const validateSessionHandle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(SESSION_TOKEN_NAME) ?? null;
	if (token === null) {
		event.locals.session = null;
		event.locals.user = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		setSessionToken(event, token, session.expiresAt);
	} else {
		deleteSessionToken(event);
	}

	event.locals.session = session;
	event.locals.user = user;

	return resolve(event);
};

export const handle: Handle = sequence(
	async ({ event, resolve }) => {
		if (!event.platform) {
			console.error(`event.platform IS MISSING!!!!!`);

			return new Response(null, {
				status: 500
			});
		}
		event.locals.R2 = event.platform!.env.R2;
		return resolve(event);
	},
	validateSessionHandle,
	createTRPCHandle({ router, createContext, url: TRPC_PATH })
);
