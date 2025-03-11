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
            console.log("start tx");
            const user = await createUser(tx_db, {
                displayName: form.data.displayName,
                handle: form.data.handle
            });

            console.log("tx insert email");
            await insertEmailAddress(tx_db, form.data.emailAddress, user.id);
            console.log("tx assign password");
            await assignPasswordToUser(tx_db, event, user.id, form.data.password);

            console.log("tx gen challenge")
            const challenge = await generateEmailValidation(tx_db, event, form.data.emailAddress);
            console.log("tx send challenge");
            await sendEmailValidationChallenge(
                tx_db,
                user.displayName,
                form.data.emailAddress,
                event.url,
                challenge
            );

            console.log("tx challenge sent")
            return user;
        });

        console.log('tx commit');

        // user won't have mfa
        //
        // it'd be set to true off the get to anyway
        const sessionFlags: SessionFlags = {
            mfaVerified: null
        };

        console.log('session')
        const sessionToken = generateSessionToken();
        const session = await createSession(event.locals.DB, sessionToken, user.id, sessionFlags);
        setSessionToken(event, sessionToken, session.expiresAt);

        console.log('session created and assigned');
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
