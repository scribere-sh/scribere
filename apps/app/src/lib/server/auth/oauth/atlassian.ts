import { getVariantCallbackURL, type OAuth2ClientVariant } from './variant';

import { env } from '$env/dynamic/private';

import { Atlassian } from 'arctic';

export const atlassianFactory = (req_url: URL, variant: OAuth2ClientVariant = 'auth') => {
	const callbackUrlPath = getVariantCallbackURL('atlassian', variant);
	const callbackURL = structuredClone(req_url);
	callbackURL.pathname = callbackUrlPath;

	return new Atlassian(
		env.ATLASSIAN_CLIENT_ID!,
		env.ATLASSIAN_CLIENT_SECRET!,
		callbackURL.toString()
	);
};
