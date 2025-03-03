import type { RequestEvent } from '@sveltejs/kit';

import { createContext } from './context';
import { t, TRPCLog } from './init';

import { usersTable } from '$lib/server/drizzle';

import z from 'zod';

export const router = t.router({
	hello_world: t.procedure
		.input(
			z
				.object({
					name: z.string().optional()
				})
				.strict()
		)
		.query(async ({ input, ctx }) => {
			const name = input.name?.trim();

			await ctx.locals.DB.insert(usersTable).values({
				id: 69
			});

			const message = name !== undefined ? `Hello, ${name}!` : `Hello, World!`;

			TRPCLog.success(`Greeting ${name || 'World'}`);

			return { message };
		})
});

export type Router = typeof router;

const factory = t.createCallerFactory(router);

export const createCaller = async (event: RequestEvent) => {
	return factory(await createContext(event));
};
