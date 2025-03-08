import type { RequestEvent } from '@sveltejs/kit';

import { route } from '$lib/ROUTES';

export const AUTH_RETURN_PATH = 'return_path';

/**
 * Allowed
 * /home
 * /auth/mfa
 *
 * Not Allowed
 * //bad.com (open redirect)
 * https://bad.com (open redirect)
 */
const returnPathRefex = /^\/{1}[^\/]{1}.+$/;

export const getReturnPathFromCookie = (event: RequestEvent) => {
    const returnPath = event.cookies.get(AUTH_RETURN_PATH);
    if (!returnPath) return null;

    return returnPathRefex.test(returnPath) ? returnPath : route('/');
};
