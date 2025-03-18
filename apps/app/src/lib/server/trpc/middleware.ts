import { t } from '.';
import { TRPCError } from '@trpc/server';

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
