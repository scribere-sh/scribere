import { getVariantCallbackURL, type OAuth2ClientVariant } from './variant';

import { env } from '$env/dynamic/private';

import { GitHub } from 'arctic';

export const githubFactory = (req_url: URL, variant: OAuth2ClientVariant = 'auth') => {
	const callbackUrlPath = getVariantCallbackURL('github', variant);
	const callbackURL = structuredClone(req_url);
	callbackURL.pathname = callbackUrlPath;

	return new GitHub(env.GITHUB_CLIENT_ID!, env.GITHUB_CLIENT_SECRET!, callbackURL.toString());
};
