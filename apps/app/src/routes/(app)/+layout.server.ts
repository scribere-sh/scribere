import type { LayoutServerLoad } from './$types';

import { route } from '$lib/ROUTES';
import { AUTH_RETURN_PATH } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
	if (!locals.session || !locals.user || !locals.session.mfaVerified) {
		cookies.set(AUTH_RETURN_PATH, url.pathname, {
			httpOnly: true,
			maxAge: 60 * 10,
			// eslint-disable-next-line turbo/no-undeclared-env-vars
			secure: import.meta.env.PROD,
			path: '/',
			sameSite: 'lax'
		});
	}

	if (!locals.session || !locals.user) {
		redirect(302, route('/auth/log-in'));
	}

	if (!locals.session.mfaVerified) {
		redirect(302, route('/auth/mfa'));
	}
};
