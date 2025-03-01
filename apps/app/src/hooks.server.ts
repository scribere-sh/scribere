import { createContext } from '$lib/server/trpc/context';
import { router } from '$lib/server/trpc/router';
import { TRPC_PATH } from '$lib/trpc';

import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { drizzle } from 'drizzle-orm/d1';

import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = sequence(
	async ({ event, resolve }) => {
		event.locals.DB = drizzle(event.platform!.env.DB);
		event.locals.R2 = event.platform!.env.R2;
		return await resolve(event);
	},
	createTRPCHandle({ router, createContext, url: TRPC_PATH })
);
