import type { Actions, PageServerLoad } from './$types';

import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { AUTH_RETURN_PATH } from '$auth';
import { assignPasswordToUser, verifyPasswordOfUser } from '$auth/password';
import { unlinkOAuthProviderFromUser } from '$auth/user';

import { resetPasswordAccountSettingsSchema } from '$client/forms';
import { ALL_OAUTH_PROVIDERS, OAuth2Providers, OAUTH_ACTION_NAME } from '$oauth';
import { route } from '$routes';

export const actions: Actions = {
    'link-oauth': async (event) => {
        const formData = await event.request.formData();
        const provider = formData.get('provider')?.toString();
        if (!provider) return fail(400);
        if (!ALL_OAUTH_PROVIDERS.includes(provider!)) return fail(400);

        const redirectRoute = route('GET /oauth/[provider]', { provider });

        event.cookies.set(OAUTH_ACTION_NAME, 'link', {
            httpOnly: true,
            maxAge: 60 * 10,
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            secure: import.meta.env.PROD,
            path: '/',
            sameSite: 'lax'
        });

        event.cookies.set(AUTH_RETURN_PATH, route('/account/settings'), {
            httpOnly: true,
            maxAge: 60 * 10,
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            secure: import.meta.env.PROD,
            path: '/',
            sameSite: 'lax'
        });

        redirect(303, redirectRoute);
    },

    'unlink-oauth': async (event) => {
        const formData = await event.request.formData();
        const provider = formData.get('provider')?.toString();
        if (!provider) return fail(400);

        unlinkOAuthProviderFromUser(provider, event.locals.user!.id);
    },

    'update-password': async (event) => {
        const form = await superValidate(event, zod(resetPasswordAccountSettingsSchema));
        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        if (form.data.newPassword !== form.data.confirmNewPassword) {
            setError(form, 'newPassword', 'Passwords do not match');
            setError(form, 'confirmNewPassword', 'Passwords do not match');

            return fail(400, {
                form
            });
        }

        if (!(await verifyPasswordOfUser(event.locals.user!.id, form.data.currentPassword))) {
            return setError(form, 'currentPassword', 'Password incorrect');
        }

        if (await verifyPasswordOfUser(event.locals.user!.id, form.data.newPassword)) {
            setError(form, 'newPassword', 'Password is the same as old password');
            setError(form, 'confirmNewPassword', 'Password is the same as old password');

            return fail(400, {
                form
            });
        }

        await event.locals.DB.transaction(async (tx_db) => {
            await assignPasswordToUser(event.locals.user!.id, form.data.newPassword, tx_db);
        });
    }
};

export const load: PageServerLoad = () => {
    return {
        activeMethods: OAuth2Providers.validProviders
    };
};
