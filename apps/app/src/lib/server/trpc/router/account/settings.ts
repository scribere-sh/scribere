import { TRPCError } from '@trpc/server';
import { and, eq, inArray, not } from 'drizzle-orm';
import { z } from 'zod';

import { displayNameSchema, handleSchema } from '$client/forms/parts';
import { authProviderTable, twoFactorAuthenticationProviderTable, usersTable } from '$db/tables';
import { ALL_OAUTH_PROVIDERS } from '$oauth';
import { t, TRPCLog } from '$trpc';
import { authMiddleware } from '$trpc/middleware';
import { TOTP_TYPE } from '$auth/mfa';

const router = t.router({
    loadAuthSettings: t.procedure.use(authMiddleware).query(async ({ ctx }) => {
        const oauthMethods = await ctx.locals.DB.select({ id: authProviderTable.type })
            .from(authProviderTable)
            .where(
                and(
                    eq(authProviderTable.userId, ctx.locals.user!.id),
                    inArray(authProviderTable.type, ALL_OAUTH_PROVIDERS)
                )
            );

        const mfaMethods = await ctx.locals.DB.select({ type: twoFactorAuthenticationProviderTable.type }).from(twoFactorAuthenticationProviderTable)
        .where(and(
            eq(twoFactorAuthenticationProviderTable.userId, ctx.locals.user!.id),
            inArray(twoFactorAuthenticationProviderTable.type, [TOTP_TYPE])
        ))

        return {
            oauthMethods: oauthMethods.map(({ id }) => id),
            mfaMethods: mfaMethods.map(({type}) => type)
        };
    }),

    updateDisplayName: t.procedure
        .use(authMiddleware)
        .input(
            z.object({
                displayName: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!displayNameSchema.safeParse(input.displayName).success)
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Invalid Display Name'
                });

            const userId = ctx.locals.user!.id;

            try {
                return (
                    await ctx.locals.DB.update(usersTable)
                        .set(input)
                        .where(eq(usersTable.id, userId))
                        .returning({ displayName: usersTable.displayName })
                )[0];
            } catch (e: unknown) {
                TRPCLog.error(`Unable to update Display Name`, e);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update Display Name'
                });
            }
        }),

    updateHandle: t.procedure
        .use(authMiddleware)
        .input(
            z.object({
                handle: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!handleSchema.safeParse(input.handle).success)
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Invalid Handle'
                });

            const userId = ctx.locals.user!.id;

            if (
                (
                    await ctx.locals.DB.select()
                        .from(usersTable)
                        .where(
                            and(eq(usersTable.handle, input.handle), not(eq(usersTable.id, userId)))
                        )
                ).length > 0
            )
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Handle is Taken'
                });

            try {
                return (
                    await ctx.locals.DB.update(usersTable)
                        .set(input)
                        .where(eq(usersTable.id, userId))
                        .returning({ handle: usersTable.handle })
                )[0];
            } catch (e: unknown) {
                TRPCLog.error(`Unable to update Display Name`, e);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update Handle'
                });
            }
        })
});

export default router;
