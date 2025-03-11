import type { Atlassian, GitHub, Google } from 'arctic';

import { generateTokenString } from '$auth/cryptography';

import { env } from '$env/dynamic/private';
import { atlassianFactory } from '$oauth/atlassian';
import { githubFactory } from '$oauth/github';
import { googleFactory } from '$oauth/google';
import validate from '$oauth/validate-env';

export type OAuth2ClientFactory<Client> = (req_url: URL) => { client: Client; scopes: string[] };

export class OAuth2Providers {
    static get github(): OAuth2ClientFactory<GitHub> | null {
        return validate.github() ? githubFactory : null;
    }

    static get atlassian(): OAuth2ClientFactory<Atlassian> | null {
        return validate.atlassian() ? atlassianFactory : null;
    }

    static get google(): OAuth2ClientFactory<Google> | null {
        return validate.google() ? googleFactory : null;
    }

    static get validProviders(): string[] {
        const list = [];
        if (OAuth2Providers.github != null) list.push('github');
        if (OAuth2Providers.atlassian != null) list.push('atlassian');
        if (OAuth2Providers.google !== null) list.push('google');

        return list;
    }
}

export const generateState = generateTokenString;

export const STATE_COOKIE_NAME = 'state';
/**
 * Cookie used to differentiate between auth and link
 *
 * must confirm that oauth isn't already connected
 */
export const OAUTH_ACTION_NAME = 'oauth_action';
export const OAUTH_SKIPS_MFA = env.OAUTH_SKIP_MFA === 'true';

export const ALL_OAUTH_PROVIDERS = ['github', 'atlassian', 'google'];
