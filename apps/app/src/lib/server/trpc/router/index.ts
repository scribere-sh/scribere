import z from 'zod';

import { t, TRPCLog } from '$trpc';

import account from './account';

const router = t.router({
	account,

	hello_world: t.procedure
		.input(
			z
				.object({
					name: z.string().optional()
				})
				.strict()
		)
		.query(async ({ input }) => {
			const name = input.name?.trim();

			const message = name !== undefined ? `Hello, ${name}!` : `Hello, World!`;

			TRPCLog.success(`Greeting ${name || 'World'}`);

			return { message };
		})
});

export default router;
