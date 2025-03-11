import type { RequestHandler } from './$types';

import { setReturnPathCookie } from '$auth';
import { generateState, OAuth2Providers, OAUTH_ACTION_NAME, STATE_COOKIE_NAME } from '$oauth';

export const GET: RequestHandler = async ({ params, cookies, url }) => {
    const validProviders = OAuth2Providers.validProviders;

    let returnPath = url.searchParams.get('return');
    if (returnPath) {
        returnPath = decodeURIComponent(returnPath);
    }

    let oauthAction = url.searchParams.get('action');
    if (oauthAction) {
        oauthAction = decodeURIComponent(oauthAction);
    }

    if (!validProviders.includes(params.provider)) {
        return new Response(null, {
            status: 400
        });
    }

    const providerKey = params.provider as 'github' | 'atlassian';
    const providerFactory = OAuth2Providers[providerKey]!;

    const { client, scopes } = providerFactory(url);

    const state = generateState();
    const authURL = client.createAuthorizationURL(state, scopes);

    cookies.set(STATE_COOKIE_NAME, state, {
        httpOnly: true,
        maxAge: 60 * 10,
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        secure: import.meta.env.PROD,
        path: '/',
        sameSite: 'lax'
    });

    if (returnPath) {
        setReturnPathCookie(cookies, returnPath);
    }

    if (oauthAction) {
        cookies.set(OAUTH_ACTION_NAME, oauthAction, {
            httpOnly: true,
            maxAge: 60 * 10,
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            secure: import.meta.env.PROD,
            path: '/',
            sameSite: 'lax'
        });
    }

    return new Response(null, {
        status: 302,
        headers: {
            Location: authURL.toString()
        }
    });
};
