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
const returnPathRefex = /^\/{1}[^/]{1}.+$/;

export const getReturnPathFromCookie = (cookies: RequestEvent['cookies']) => {
	const returnPath = cookies.get(AUTH_RETURN_PATH);
	if (!returnPath) return null;

	return returnPathRefex.test(returnPath) ? returnPath : route('/');
};

export const setReturnPathCookie = (cookies: RequestEvent['cookies'], path: string) => {
	cookies.set(AUTH_RETURN_PATH, path, {
		httpOnly: true,
		maxAge: 60 * 10,
		// eslint-disable-next-line turbo/no-undeclared-env-vars
		secure: import.meta.env.PROD,
		path: '/',
		sameSite: 'lax'
	});
};

export const clearReturnPathCookie = (cookies: RequestEvent['cookies']) => {
	cookies.delete(AUTH_RETURN_PATH, {
		path: '/'
	});
};
