import { generateTokenString } from '../auth/cryptography';
import { atlassianFactory } from './atlassian';
import { githubFactory } from './github';
import validate from './validate-env';
import type { Atlassian, GitHub } from 'arctic';

import { env } from '$env/dynamic/private';

export type OAuth2ClientFactory<Client> = (req_url: URL) => { client: Client; scopes: string[] };

export class OAuth2Providers {
    static get github(): OAuth2ClientFactory<GitHub> | null {
        return validate.github() ? githubFactory : null;
    }

    static get atlassian(): OAuth2ClientFactory<Atlassian> | null {
        return validate.atlassian() ? atlassianFactory : null;
    }

    static get validProviders(): string[] {
        const list = [];
        if (OAuth2Providers.github != null) list.push('github');
        if (OAuth2Providers.atlassian != null) list.push('atlassian');

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

export const ALL_OAUTH_PROVIDERS = ['github', 'atlassian'];
