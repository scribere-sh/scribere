import { TRPCError } from '@trpc/server';
import { and, eq, inArray, not } from 'drizzle-orm';
import { renderSVG } from 'uqr';
import { z } from 'zod';

import { generateTokenString } from '$auth/cryptography';
import { enrolUserWithTOTP, generateMFARecoveryCode, generateTOTPEnrollmentURL, setRecoveryCodeForUser, TOTP_RECOVERY_TYPE, TOTP_TYPE, userHasTOTP, verifyOTP } from '$auth/mfa';

import { displayNameSchema, handleSchema } from '$client/forms/parts';
import { authProviderTable, twoFactorAuthenticationProviderTable, usersTable } from '$db/tables';
import { ALL_OAUTH_PROVIDERS } from '$oauth';
import { t, TRPCLog } from '$trpc';
import { authMiddleware } from '$trpc/middleware';

const router = t.router({
    // #region Queryies
    loadAuthSettings: t.procedure.use(authMiddleware).query(async ({ ctx }) => {
        const oauthMethods = await ctx.locals.DB.select({ id: authProviderTable.type })
            .from(authProviderTable)
            .where(
                and(
                    eq(authProviderTable.userId, ctx.locals.user!.id),
                    inArray(authProviderTable.type, ALL_OAUTH_PROVIDERS)
                )
            );

        const mfaMethods = await ctx.locals.DB.select({
            type: twoFactorAuthenticationProviderTable.type
        })
            .from(twoFactorAuthenticationProviderTable)
            .where(
                and(
                    eq(twoFactorAuthenticationProviderTable.userId, ctx.locals.user!.id),
                    inArray(twoFactorAuthenticationProviderTable.type, [TOTP_TYPE])
                )
            );

        return {
            oauthMethods: oauthMethods.map(({ id }) => id),
            mfaMethods: mfaMethods.map(({ type }) => type)
        };
    }),

    generateTOTPEnrollment: t.procedure.use(authMiddleware).query(async ({ ctx }) => {
        const TOTPKey = generateTokenString(32);
        const keyURI = generateTOTPEnrollmentURL(TOTPKey, ctx.user.id);

        return {
            TOTPKey,
            keyURI,
            QRCode: renderSVG(keyURI)
        };
    }),

    // #endregion

    // #region Mutations
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
        }),

    enrolUserInTOTP: t.procedure
        .use(authMiddleware)
        .input(z.object({
            key: z.string().nonempty().max(250),
            initialCode: z.string().length(6).regex(/^[0-9]{6}$/i)
        }))
        .mutation(async ({ ctx, input }) => {
            if (await userHasTOTP(ctx.locals.DB, ctx.session.userId)) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "User is already enrolled with MFA"
                });
            }

            if (!verifyOTP(input.key, input.initialCode)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Incorrect MFA Code"
                });
            }

            generateMFARecoveryCode();

            const recoveryCode = await ctx.locals.DB.transaction(async (tx_db) => {
                const recoveryCode = generateMFARecoveryCode();

                await setRecoveryCodeForUser(
                    tx_db,
                    ctx,
                    ctx.session.userId,
                    recoveryCode
                );

                await enrolUserWithTOTP(
                    tx_db,
                    ctx.session.userId,
                    input.key,
                    input.initialCode
                );

                return recoveryCode
            });

            return {
                recoveryCode
            };
        }),

    unenrolUserFromTOTP: t.procedure.mutation(async ({ctx}) => {
        await ctx.locals.DB.delete(twoFactorAuthenticationProviderTable).where(and(
            eq( twoFactorAuthenticationProviderTable.userId, ctx.session!.userId),
            inArray(twoFactorAuthenticationProviderTable.type, [
                TOTP_TYPE,
                TOTP_RECOVERY_TYPE
            ])
        ));
    })
    // #endregion
});

export default router;
