import type { Action, Actions, PageServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { insertEmailAddress, verifyEmailAddressAvailability } from '$auth/email';
import { generateEmailValidation, sendEmailValidationChallenge } from '$auth/email-validation';
import { assignPasswordToUser, verifyPasswordStrength } from '$auth/password';
import {
    createSession,
    generateSessionToken,
    type SessionFlags,
    setSessionToken
} from '$auth/session';
import { createUser, lookupHandleAvailability } from '$auth/user';

import { signupFormSchema } from '$client/forms';
import { route } from '$routes';

export const actions: Actions = {
    default: (async (event) => {
        const form = await superValidate(event, zod(signupFormSchema));
        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        if (form.data.password !== form.data.passwordConfirm) {
            return setError(form, 'passwordConfirm', 'Passwords do not match');
        }

        if (!(await verifyEmailAddressAvailability(form.data.emailAddress))) {
            return setError(form, 'emailAddress', 'Email Address already in use!');
        }

        if (!(await lookupHandleAvailability(form.data.handle))) {
            return setError(form, 'handle', 'Handle already taken');
        }

        if (!(await verifyPasswordStrength(form.data.password))) {
            return setError(form, 'password', 'Password is not strong enough!');
        }

        const user = await event.locals.DB.transaction(async (tx_db) => {
            const user = await createUser(
                {
                    displayName: form.data.displayName,
                    handle: form.data.handle
                },
                tx_db
            );

            await insertEmailAddress(form.data.emailAddress, user.id, tx_db);
            await assignPasswordToUser(user.id, form.data.password, tx_db);

            const challenge = await generateEmailValidation(form.data.emailAddress, tx_db);
            await sendEmailValidationChallenge(
                user.displayName,
                form.data.emailAddress,
                challenge,
                tx_db
            );

            return user;
        });

        // user won't have mfa to start
        const sessionFlags: SessionFlags = {
            mfaVerified: null
        };

        const sessionToken = generateSessionToken();
        const session = await createSession(sessionToken, user.id, sessionFlags);
        setSessionToken(sessionToken, session.expiresAt);

        redirect(303, route('/'));
    }) satisfies Action
};

export const load: PageServerLoad = async ({ locals }) => {
    if (!!locals.session && !!locals.user) {
        redirect(303, route('/'));
    }

    return {
        form: await superValidate(zod(signupFormSchema))
    };
};
