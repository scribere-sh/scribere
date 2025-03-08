import type { RequestHandler } from './$types';

import { generateState, OAuth2Providers, STATE_COOKIE_NAME } from '$lib/server/oauth';

export const GET: RequestHandler = async ({ params, cookies, url }) => {
	const validProviders = OAuth2Providers.validProviders;

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

	return new Response(null, {
		status: 302,
		headers: {
			Location: authURL.toString()
		}
	});
};
