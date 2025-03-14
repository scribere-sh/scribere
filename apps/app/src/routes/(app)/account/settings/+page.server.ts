import type { Actions, PageServerLoad } from './$types';

import { fail, redirect } from '@sveltejs/kit';

import { AUTH_RETURN_PATH } from '$auth';
import { unlinkOAuthProviderFromUser } from '$auth/user';

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

        unlinkOAuthProviderFromUser(event.locals.DB, provider, event.locals.user!.id);
    }
};

export const load: PageServerLoad = () => {
    return {
        activeMethods: OAuth2Providers.validProviders
    };
};
