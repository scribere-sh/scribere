import type { Actions, PageServerLoad } from './$types';

import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { updateUserPassword } from '$auth/password';
import { validatePasswordResetRefTokenPair } from '$auth/reset-password';

import { passwordResetChallengeTable } from '$db/tables';
import { resetPasswordFormSchema } from '$forms';
import { route } from '$routes';

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(resetPasswordFormSchema));
        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        if (form.data.newPassword !== form.data.newPasswordConfirm) {
            return setError(form, 'newPassword', 'New passwords do not match');
        }

        console.log('passwords match');

        if (
            !(await validatePasswordResetRefTokenPair(
                event.locals.DB,
                event,
                form.data.challengeRef,
                form.data.challengeToken
            ))
        ) {
            // Invalid challenge
            console.log('invalid challenge');
            return fail(401);
        }

        console.log('valid challenge');

        const [user] = await event.locals.DB.select({ id: passwordResetChallengeTable.userId })
            .from(passwordResetChallengeTable)
            .where(eq(passwordResetChallengeTable.challengeRef, form.data.challengeRef));

        if (!user) {
            console.log('no user found');
            return fail(500);
        }

        console.log('found user');

        await updateUserPassword(event.locals.DB, event, user.id, form.data.newPassword);
        await event.locals.DB.delete(passwordResetChallengeTable).where(
            eq(passwordResetChallengeTable.challengeRef, form.data.challengeRef)
        );

        console.log('updated');

        redirect(302, route('/auth/sign-in'));
    }
};

export const load: PageServerLoad = async (event) => {
    const challengeRef = event.url.searchParams.get('reset_ref');
    const challengeToken = event.url.searchParams.get('reset_token');

    if (!challengeRef || !challengeToken) {
        error(400);
    }

    if (
        !(await validatePasswordResetRefTokenPair(
            event.locals.DB,
            event,
            challengeRef,
            challengeToken
        ))
    ) {
        error(401);
    }

    return {
        challengeRef,
        challengeToken,
        form: await superValidate(zod(resetPasswordFormSchema))
    };
};
