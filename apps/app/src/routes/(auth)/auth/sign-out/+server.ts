import type { RequestHandler } from './$types';

import { deleteSessionToken, invalidateSession } from '$auth/session';

import { route } from '$routes';
import { DB } from '$db';

export const GET: RequestHandler = async (event) => {
    if (event.locals.session) await invalidateSession(DB(), event.locals.session.id);

    deleteSessionToken(event);

    return new Response(null, {
        status: 302,
        headers: {
            Location: route('/auth/log-in')
        }
    });
};
