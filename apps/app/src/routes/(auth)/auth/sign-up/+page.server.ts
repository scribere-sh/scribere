import type { Action, Actions, PageServerLoad } from './$types';

import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { signupFormSchema } from '$forms';

import { insertEmailAddress, verifyEmailAddressAvailability } from '$auth/email';
import { assignPasswordToUser, verifyPasswordStrength } from '$auth/password';
import { createUser, lookupHandleAvailability } from '$auth/user';

import { route } from '$routes';
import {
	generateEmailValidation,
	sendEmailValidationChallenge
} from '$auth/email-validation';
import {
	createSession,
	generateSessionToken,
	setSessionToken,
	type SessionFlags
} from '$auth/session';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: (async (event) => {
		const form = await superValidate(event, zod(signupFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (!(await verifyEmailAddressAvailability(form.data.emailAddress))) {
			return setError(form, 'emailAddress', 'Email Address already in use!');
		}

		if (!(await lookupHandleAvailability(form.data.handle))) {
			return setError(form, 'handle', 'Handle already taken');
		}

		if (!(await verifyPasswordStrength(form.data.password, event))) {
			return setError(form, 'password', 'Password is not strong enough!');
		}

		const user = await createUser({
			displayName: form.data.displayName,
			handle: form.data.handle
		});

		await insertEmailAddress(form.data.emailAddress, user.id);
		await assignPasswordToUser(event, user.id, form.data.password);

		const challenge = await generateEmailValidation(event, form.data.emailAddress);
		await sendEmailValidationChallenge(
			user.displayName,
			form.data.emailAddress,
			event.url,
			challenge
		);

		// user won't have mfa
		//
		// it'd be set to true off the get to anyway
		const sessionFlags: SessionFlags = {
			mfaVerified: null
		};

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id, sessionFlags);
		setSessionToken(event, sessionToken, session.expiresAt);

		redirect(302, route('/'));
	}) satisfies Action
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!!locals.session && !!locals.user) {
		redirect(302, route('/'));
	}

	return {
		form: await superValidate(zod(signupFormSchema))
	};
};
