import type { Actions, PageServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { AUTH_RETURN_PATH, clearReturnPathCookie, getReturnPathFromCookie } from '$auth';
import { verifyArgon2id } from '$auth/cryptography';
import { userHasTOTP } from '$auth/mfa';
import {
    createSession,
    generateSessionToken,
    type SessionFlags,
    setSessionToken
} from '$auth/session';

import { logInFormSchema } from '$client/forms';
import { authProviderTable, emailAddressTable, usersTable } from '$db/tables';
import { OAuth2Providers } from '$oauth';
import { route } from '$routes';

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(logInFormSchema));
        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        let user;
        if (z.string().email().safeParse(form.data.handleOrEmail).success) {
            const [maybeUser] = await event.locals.DB.select({
                id: emailAddressTable.userId
            })
                .from(emailAddressTable)
                .where(eq(emailAddressTable.emailAddress, form.data.handleOrEmail));

            user = maybeUser;
        } else {
            const [maybeUser] = await event.locals.DB.select({
                id: usersTable.id
            })
                .from(usersTable)
                .where(eq(usersTable.handle, form.data.handleOrEmail));

            user = maybeUser;
        }

        if (!user) {
            return setError(form, 'handleOrEmail', 'User not found');
        }

        const [authProvider] = await event.locals.DB.select({ hash: authProviderTable.hash })
            .from(authProviderTable)
            .where(
                and(eq(authProviderTable.userId, user.id), eq(authProviderTable.type, 'password'))
            );

        if (!authProvider || !authProvider.hash) {
            return fail(500, {
                form,
                message: 'HOW ON GODS GREEN EARTH DO YOU NOT HAVE A PASSWORD SET'
            });
        }

        if (!(await verifyArgon2id(authProvider.hash, form.data.password))) {
            return setError(form, 'password', 'Password Incorrect');
        }

        const userHasMFA = await userHasTOTP(user.id);

        const sessionFlags: SessionFlags = {
            mfaVerified: userHasMFA ? false : null
        };

        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, user.id, sessionFlags);
        setSessionToken(sessionToken, session.expiresAt);

        if (userHasMFA) {
            redirect(303, route('/auth/mfa'));
        } else {
            const returnPath = getReturnPathFromCookie();
            clearReturnPathCookie();
            redirect(303, returnPath ?? route('/'));
        }
    }
};

export const load: PageServerLoad = async ({ url, cookies }) => {
    const returnPath = url.searchParams.get('return');

    if (returnPath) {
        cookies.set(AUTH_RETURN_PATH, decodeURIComponent(returnPath), {
            httpOnly: true,
            maxAge: 60 * 10,
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            secure: import.meta.env.PROD,
            path: '/',
            sameSite: 'lax'
        });
    }

    return {
        useableProviders: OAuth2Providers.validProviders,
        form: await superValidate(zod(logInFormSchema))
    };
};
