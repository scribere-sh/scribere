import type { RequestHandler } from './$types';

import { ObjectParser } from '@pilcrowjs/object-parser';
import type { OAuth2Tokens } from 'arctic';
import { OAuth2RequestError } from 'arctic';

import { clearReturnPathCookie, getReturnPathFromCookie } from '$auth';
import { userHasTOTP } from '$auth/mfa';
import {
    createSession,
    generateSessionToken,
    invalidateSession,
    type SessionFlags,
    setSessionToken
} from '$auth/session';
import { linkOAuthProviderToUser, lookupUserIdFromOAuthProvider } from '$auth/user';

import { DB } from '$db';
import { OAuth2Providers, OAUTH_ACTION_NAME, OAUTH_SKIPS_MFA, STATE_COOKIE_NAME } from '$oauth';
import { route } from '$routes';

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

    const oauthAction = event.cookies.get(OAUTH_ACTION_NAME);
    const returnPath = getReturnPathFromCookie(event.cookies) ?? route('/');

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

    event.cookies.delete(STATE_COOKIE_NAME, {
        path: '/'
    });
    try {
        return await DB.transaction(async (tx_db) => {
            const tokens = await client.validateAuthorizationCode(code);
            const providerUserId = await IDENTITY_TRANSLATORS[providerKey](tokens);

            if (!providerUserId) return new Response(null, { status: 500 });

            if (oauthAction === 'link' && event.locals.session) {
                const userId = event.locals.session.userId;

                await linkOAuthProviderToUser(tx_db, providerUserId, event.params.provider, userId);

                return new Response(null, {
                    status: 302,
                    headers: {
                        Location: returnPath
                    }
                });
            }

            const localUserId = await lookupUserIdFromOAuthProvider(
                tx_db,
                providerUserId,
                event.params.provider
            );

            if (!localUserId) {
                return new Response(null, {
                    status: 400
                });
            }

            const userHasMFA = await userHasTOTP(tx_db, localUserId);

            const sessionFlags: SessionFlags = {
                mfaVerified: userHasMFA ? OAUTH_SKIPS_MFA : null
            };

            // if session already exists, invalidate it first
            if (event.locals.session) await invalidateSession(tx_db, event.locals.session.id);

            const sessionToken = generateSessionToken();
            const session = await createSession(tx_db, sessionToken, localUserId, sessionFlags);
            setSessionToken(event, sessionToken, session.expiresAt);

            if (!userHasMFA) clearReturnPathCookie(event.cookies);
            const redirectPath = userHasMFA && !OAUTH_SKIPS_MFA ? route('/auth/mfa') : returnPath;

            return new Response(null, {
                status: 302,
                headers: {
                    Location: redirectPath
                }
            });
        });
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
