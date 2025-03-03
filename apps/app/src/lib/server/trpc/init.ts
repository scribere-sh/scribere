import type { Context } from './context';

import { dev } from '$app/environment';
import { transformer } from '$lib/trpc';

import { initTRPC } from '@trpc/server';
import { ZodError } from 'zod';

import { Log } from '@kitql/helpers';

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
