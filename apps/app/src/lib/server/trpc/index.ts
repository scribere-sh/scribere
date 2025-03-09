import { Log } from '@kitql/helpers';
import { initTRPC } from '@trpc/server';
import { ZodError } from 'zod';

import { dev } from '$app/environment';
import { transformer } from '$lib/client/trpc';
import { type Context } from './context';

import router from './router';

export const TRPCLog = new Log('tRPC', {
	withDate: 'dateTime'
});

export const t = initTRPC.context<Context>().create({
	transformer,
	errorFormatter: dev
		? ({ shape, error }) => {
				console.error(error);

				return {
					...shape,
					data: {
						...shape.data,
						zodError:
							error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
								? error.cause.flatten()
								: null
					}
				};
			}
		: undefined
});

export type Router = typeof router;

// const factory = t.createCallerFactory(router);

// export const createCaller = async (event: RequestEvent) => {
// 	return factory(await createContext(event));
// };
