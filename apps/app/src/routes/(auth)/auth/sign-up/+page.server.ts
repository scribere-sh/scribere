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

import { signupFormSchema } from '$forms';
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

        if (!(await verifyEmailAddressAvailability(event.locals.DB, form.data.emailAddress))) {
            return setError(form, 'emailAddress', 'Email Address already in use!');
        }

        if (!(await lookupHandleAvailability(event.locals.DB, form.data.handle))) {
            return setError(form, 'handle', 'Handle already taken');
        }

        if (!(await verifyPasswordStrength(form.data.password, event))) {
            return setError(form, 'password', 'Password is not strong enough!');
        }

        const user = await event.locals.DB.transaction(async (tx_db) => {
            const user = await createUser(tx_db, {
                displayName: form.data.displayName,
                handle: form.data.handle
            });

            await insertEmailAddress(tx_db, form.data.emailAddress, user.id);
            await assignPasswordToUser(tx_db, event, user.id, form.data.password);

            const challenge = await generateEmailValidation(tx_db, event, form.data.emailAddress);
            await sendEmailValidationChallenge(
                tx_db,
                user.displayName,
                form.data.emailAddress,
                event.url,
                challenge
            );

            return user;
        });

        // user won't have mfa
        //
        // it'd be set to true off the get to anyway
        const sessionFlags: SessionFlags = {
            mfaVerified: null
        };

        const sessionToken = generateSessionToken();
        const session = await createSession(event.locals.DB, sessionToken, user.id, sessionFlags);
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
