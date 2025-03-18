import { getRequestEvent } from '$app/server';
import { route } from '$routes';

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

export const getReturnPathFromCookie = () => {
    const { cookies } = getRequestEvent();

    const returnPath = cookies.get(AUTH_RETURN_PATH);
    if (!returnPath) return null;

    return returnPathRefex.test(returnPath) ? returnPath : route('/');
};

export const setReturnPathCookie = (path: string) => {
    const { cookies } = getRequestEvent();

    cookies.set(AUTH_RETURN_PATH, path, {
        httpOnly: true,
        maxAge: 60 * 10,
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        secure: import.meta.env.PROD,
        path: '/',
        sameSite: 'lax'
    });
};

export const clearReturnPathCookie = () => {
    const { cookies } = getRequestEvent();

    cookies.delete(AUTH_RETURN_PATH, {
        path: '/'
    });
};
