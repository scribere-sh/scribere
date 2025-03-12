import type { RequestHandler } from './$types';

import { deleteSessionToken, invalidateSession } from '$auth/session';

import { route } from '$routes';

export const GET: RequestHandler = async (event) => {
    if (event.locals.session) await invalidateSession(event.locals.DB, event.locals.session.id);

    deleteSessionToken(event);
    event.cookies.set('message', 'logged-out', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        secure: import.meta.env.PROD,
        maxAge: 60
    });

    return new Response(null, {
        status: 303,
        headers: {
            Location: route('/auth/sign-in')
        }
    });
};
