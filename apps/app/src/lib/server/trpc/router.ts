import type { RequestEvent } from '@sveltejs/kit';

import { t, TRPCLog } from './init';
import { createContext } from './context';

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
		.query(({ input }) => {
            const name = input.name?.trim();

			const message = name !== undefined ? `Hello, ${name}!` : `Hello, World!`;

            TRPCLog.success(`Greeting ${name || "World"}`);

			return { message };
		})
});

export type Router = typeof router;

const factory = t.createCallerFactory(router);

export const createCaller = async (event: RequestEvent) => {
	return factory(await createContext(event));
};
