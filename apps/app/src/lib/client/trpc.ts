// import for tsdoc, ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { page } from '$app/state';

import type { Router } from '$trpc';

import type { QueryClient } from '@tanstack/svelte-query';
import { svelteQueryWrapper } from 'trpc-svelte-query-adapter';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';

import * as Devalue from 'devalue';
import SuperJSON from 'superjson';

import { browser } from '$app/environment';
import { httpLink } from '@trpc/client';

export const TRPC_PATH = `/__trpc`;

export const transformer = {
	/**
	 * Client -> Server
	 *
	 * The safe bet because Devalue takes a value and turns it into a JS
	 * Expression which is an RCE if the client were to inject something.
	 */
	input: SuperJSON,
	/**
	 * Server -> Client
	 *
	 * Since the server is trusted we can use Devalue (which is much more
	 * efficient than SuperJSON) in spite of the potential for an RCE.
	 *
	 * This is what sveltekit uses under the hood and the devalue package
	 * is maintained by Rich Harris himself.
	 */
	output: {
		serialize: Devalue.stringify,
		deserialize: Devalue.parse
	},
	__default: true
};

let __browserClient: ReturnType<typeof svelteQueryWrapper<Router>>;

/**
 * allows client-side tRPC access
 *
 * @param init it's easier to just set this to {@link page | `$page`}
 * @returns a `trpc-svelte-query-wrapper` client
 */
export const trpc = (init?: TRPCClientInit, queryClient?: QueryClient) => {
	if (browser && __browserClient) return __browserClient;

	const client = svelteQueryWrapper({
		client: createTRPCClient<Router>({
			transformer,
			links: [
				httpLink({
					url: TRPC_PATH,
					fetch: init?.fetch
				})
			]
		}),
		queryClient
	});

	if (browser) __browserClient = client;
	return client;
};
