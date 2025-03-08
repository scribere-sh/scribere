import type { RequestHandler } from './$types';

import { ObjectParser } from '@pilcrowjs/object-parser';

import { OAuth2Providers, STATE_COOKIE_NAME } from '$lib/server/oauth';
import { OAuth2RequestError, OAuth2Tokens } from 'arctic';
import { lookupUserIdFromOAuthProvider } from '$lib/server/auth/user';
import { userHasTOTP } from '$lib/server/auth/mfa';
import { createSession, generateSessionToken, setSessionToken, type SessionFlags } from '$lib/server/auth/session';
import { route } from '$lib/ROUTES';

const IDENTITY_TRANSLATORS: Record<string, (tokens: OAuth2Tokens) => Promise<string>> = {
	github: async (tokens) => {
		const request = new Request('https://api.github.com/user');
		request.headers.set('Authorization', `Bearer ${tokens.refreshToken()}`);

		const userResponse = await fetch(request);
		const userJson = await userResponse.json();
		const userParser = new ObjectParser(userJson);

		return userParser.getNumber('id').toString();
	},

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	atlassian: async (tokens) => {
		// todo
		return '';
	}
};

export const GET = (async (event) => {
	const state = event.url.searchParams.get('state');
	const code = event.url.searchParams.get('code');
	const storedState = event.cookies.get(STATE_COOKIE_NAME);

	if (!state || !code || state !== storedState) {
		return new Response(null, {
			status: 401
		});
	}

	const validProviders = OAuth2Providers.validProviders;

	if (!validProviders.includes(event.params.provider)) {
		return new Response(null, {
			status: 400
		});
	}

	const providerKey = event.params.provider as 'github' | 'atlassian';
	const providerFactory = OAuth2Providers[providerKey]!;

	const { client } = providerFactory(event.url);

	try {
		const tokens = await client.validateAuthorizationCode(code);
		const providerUserId = await IDENTITY_TRANSLATORS[providerKey](tokens);

        const localUserId = await lookupUserIdFromOAuthProvider(providerUserId, event.params.provider);

        if (!localUserId) {
            return new Response(null, {
                status: 400
            });
        }


        const userHasMFA = await userHasTOTP(localUserId);

		const sessionFlags: SessionFlags = {
			mfaVerified: userHasMFA ? false : null
		};

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, localUserId, sessionFlags);
		setSessionToken(event, sessionToken, session.expiresAt);

        const redirectPath = userHasMFA ? route('/auth/mfa') : route('/');

        return new Response(null, {
            status: 302,
            headers: {
                Location: redirectPath
            }
        })
	} catch (e: unknown) {
		if (e instanceof OAuth2RequestError) {
			return new Response(null, {
				status: 400
			});
		} else {
			console.error(e);
			return new Response(null, {
				status: 500
			});
		}
	}
}) satisfies RequestHandler;
