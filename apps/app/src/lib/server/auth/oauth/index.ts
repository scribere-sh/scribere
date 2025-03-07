import type { Atlassian, GitHub } from 'arctic';
import type { OAuth2ClientVariant } from './variant';

import validate from './validate-env';

import { generateTokenString } from '../cryptography';
import { atlassianFactory } from './atlassian';
import { githubFactory } from './github';

export type OAuth2ClientFactory<Client> = (req_url: URL, variant?: OAuth2ClientVariant) => Client;

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
