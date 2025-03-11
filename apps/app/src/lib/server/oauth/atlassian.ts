import { Atlassian } from 'arctic';

import { env } from '$env/dynamic/private';
import { route } from '$routes';

export const atlassianFactory = (req_url: URL) => {
    const callbackUrlPath = route('GET /oauth/[provider]/callback', { provider: 'atlassian' });
    const callbackURL = req_url;
    callbackURL.pathname = callbackUrlPath;

    return {
        client: new Atlassian(
            env.ATLASSIAN_CLIENT_ID!,
            env.ATLASSIAN_CLIENT_SECRET!,
            callbackURL.toString(),
        ),
        scopes: [] as string[],
    };
};
