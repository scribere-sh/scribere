import { env } from '$env/dynamic/private';
import { route } from '$lib/ROUTES';

import { GitHub } from 'arctic';

export const githubFactory = (req_url: URL) => {
	const callbackUrlPath = route('GET /oauth/[provider]/callback', { provider: 'github' });
	const callbackURL = req_url;
	callbackURL.pathname = callbackUrlPath;

	return {
		client: new GitHub(
			env.GITHUB_CLIENT_ID!,
			env.GITHUB_CLIENT_SECRET!,
			callbackURL.toString()
		),
		scopes: [] as string[]
	};
};
