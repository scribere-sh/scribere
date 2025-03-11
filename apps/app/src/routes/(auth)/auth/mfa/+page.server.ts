import type { Actions, PageServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { clearReturnPathCookie, getReturnPathFromCookie } from '$auth';
import { userHasTOTP, verifyUserOTP } from '$auth/mfa';
import { setSessionAsMFAVerified } from '$auth/session';

import { DB } from '$db';
import { mfaFormSchema } from '$forms';
import { route } from '$routes';

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

        const db = DB();

        const returnPath = getReturnPathFromCookie(event.cookies) ?? route('/');

        if (!(await userHasTOTP(db, event.locals.user.id))) {
            redirect(302, returnPath);
        }

        if (await verifyUserOTP(db, event.locals.user.id, form.data.mfa)) {
            await setSessionAsMFAVerified(db, event.locals.session.id);
            clearReturnPathCookie(event.cookies);
            redirect(302, returnPath);
        } else {
            return setError(form, 'mfa', 'Incorrect 2FA Token');
        }
    }
};

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session || !locals.user) {
        redirect(302, route('/auth/log-in'));
    }

    if (locals.session.mfaVerified === null) {
        // user has no mfa
        redirect(302, route('/'));
    }

    return {
        form: await superValidate(zod(mfaFormSchema))
    };
};
