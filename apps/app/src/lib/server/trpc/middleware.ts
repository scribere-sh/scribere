import { TRPCError } from '@trpc/server';

import { t } from '.';

export const authMiddleware = t.middleware(async ({ ctx, next }) => {
	if (!ctx.session || !ctx.user) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'User it not logged in'
		});
	}

	return await next({
		ctx: {
			user: ctx.user!,
			session: ctx.session!
		}
	});
});
