import type { Actions, PageServerLoad } from './$types';

import { OAuth2Providers } from '$lib/server/auth/oauth';

import { logInFormSchema } from '$lib/client/forms';

import { verifyArgon2id } from '$lib/server/auth/cryptography';
import {
	createSession,
	generateSessionToken,
	setSessionAsMFAVerified,
	setSessionToken,
	type SessionFlags
} from '$lib/server/auth/session';
import { DB } from '$lib/server/db';
import { authProviderTable, emailAddressTable } from '$lib/server/db/tables';
import { redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { setError, superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { route } from '$lib/ROUTES';
import { userHasTOTP } from '$lib/server/auth/mfa';

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(logInFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const [user] = await DB.select({
			id: emailAddressTable.userId
		})
			.from(emailAddressTable)
			.where(eq(emailAddressTable.emailAddress, form.data.emailAddress));

		if (!user) {
			return setError(form, 'emailAddress', 'Email Address not Found');
		}

		const [authProvider] = await DB.select({ hash: authProviderTable.hash })
			.from(authProviderTable)
			.where(
				and(eq(authProviderTable.userId, user.id), eq(authProviderTable.type, 'password'))
			);

		if (!authProvider || !authProvider.hash) {
			return fail(500, {
				form,
				message: 'HOW ON GODS GREEN EARTH DO YOU NOT HAVE A PASSWORD SET HUH!!?!??!?!?!'
			});
		}

		if (!(await verifyArgon2id(event, authProvider.hash, form.data.password))) {
			return setError(form, 'password', 'Password Incorrect');
		}

		const sessionFlags: SessionFlags = {
			mfaVerified: false
		};

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id, sessionFlags);
		setSessionToken(event, sessionToken, session.expiresAt);

        if (await userHasTOTP(user.id)) {
            redirect(302, route('/auth/mfa'));
        } else {
            setSessionAsMFAVerified(session.id);
            redirect(302, route('/'));
        }

	}
};

export const load: PageServerLoad = async () => {
	return {
		useableProviders: OAuth2Providers.validProviders,
		form: await superValidate(zod(logInFormSchema))
	};
};
