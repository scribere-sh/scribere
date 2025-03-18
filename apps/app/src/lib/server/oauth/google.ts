import { Google } from 'arctic';

import { env } from '$env/dynamic/private';
import { route } from '$routes';

export const googleFactory = (req_url: URL) => {
    const callbackUrlPath = route('GET /oauth/[provider]/callback', { provider: 'google' });
    const callbackURL = req_url;
    callbackURL.pathname = callbackUrlPath;

    return {
        client: new Google(
            env.GOOGLE_CLIENT_ID!,
            env.GOOGLE_CLIENT_SECRET!,
            callbackURL.toString()
        ),
        scopes: [] as string[]
    };
};
