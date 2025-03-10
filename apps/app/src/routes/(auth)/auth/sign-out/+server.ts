import type { RequestHandler } from './$types';

import { route } from '$routes';
import { deleteSessionToken, invalidateSession } from '$auth/session';

export const GET: RequestHandler = async (event) => {
	if (event.locals.session) await invalidateSession(event.locals.session.id);

	deleteSessionToken(event);

	return new Response(null, {
		status: 302,
		headers: {
			Location: route('/auth/log-in')
		}
	});
};
