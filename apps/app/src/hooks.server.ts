import { createContext } from '$lib/server/trpc/context';
import { router } from '$lib/server/trpc/router';
import { TRPC_PATH } from '$lib/trpc';

import type { Handle } from '@sveltejs/kit';

import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = createTRPCHandle({ router, createContext, url: TRPC_PATH });
