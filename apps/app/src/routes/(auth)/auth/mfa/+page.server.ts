import type { Actions, PageServerLoad } from './$types';

import { route } from '$lib/ROUTES';
import { mfaFormSchema } from '$lib/client/forms';

import { redirect } from '@sveltejs/kit';

import { userHasTOTP, verifyUserOTP } from '$lib/server/auth/mfa';
import { setSessionAsMFAVerified } from '$lib/server/auth/session';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(mfaFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (!event.locals.session || !event.locals.user) {
			redirect(302, route('/auth/log-in'));
		}

		if (!(await userHasTOTP(event.locals.user.id))) {
			// user hasn't enrolled, so well just mark them as verified and let them in
			//
			// NOTE: this should NEVER happen
			await setSessionAsMFAVerified(event.locals.session.id);
			redirect(302, route('/'));
		}

		if (!(await verifyUserOTP(event.locals.user.id, form.data.mfa))) {
			return setError(form, 'mfa', 'Incorrect 2FA Token');
		}
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !locals.user) {
		redirect(302, route('/auth/log-in'));
	}

	if (!(await userHasTOTP(locals.user.id))) {
		// user not enrolled
		//
		// user should not be redirected here in this case
		await setSessionAsMFAVerified(locals.session.id);
		redirect(302, route('/'));
	}

	return {
		form: await superValidate(zod(mfaFormSchema))
	};
};
