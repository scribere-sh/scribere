import type { LayoutServerLoad } from './$types';

import { route } from '$routes';
import { setReturnPathCookie } from '$auth';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.session || !event.locals.user) {
		setReturnPathCookie(event.cookies, event.url.pathname);
	}

	if (!event.locals.session || !event.locals.user) {
		redirect(302, route('/auth/log-in'));
	}

	if (event.locals.session.mfaVerified === false) {
		redirect(302, route('/auth/mfa'));
	}
};
