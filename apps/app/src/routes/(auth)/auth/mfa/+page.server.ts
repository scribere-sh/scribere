import type { Actions, PageServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { clearReturnPathCookie, getReturnPathFromCookie } from '$auth';
import { resetUserTOTP, userHasTOTP, verifyRecoveryCode, verifyUserOTP } from '$auth/mfa';
import { setSessionAsMFANullified, setSessionAsMFAVerified } from '$auth/session';

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

        if (
            (!form.data.mfa || form.data.mfa.length !== 6) &&
            (!form.data.recoveryCode || form.data.recoveryCode.length != 26)
        ) {
            // if neither set
            return setError(form, 'mfa', 'Please supply MFA or Recovery Code');
        }

        if (!event.locals.session || !event.locals.user) {
            redirect(303, route('/auth/sign-in'));
        }

        const returnPath = getReturnPathFromCookie(event.cookies) ?? route('/');

        if (!(await userHasTOTP(event.locals.DB, event.locals.user.id))) {
            redirect(303, returnPath);
        }

        let passed = false;

        if (form.data.recoveryCode) {
            if (
                await verifyRecoveryCode(
                    event.locals.DB,
                    event,
                    event.locals.user.id,
                    form.data.recoveryCode
                )
            ) {
                await resetUserTOTP(event.locals.DB, event.locals.user.id);
                await setSessionAsMFANullified(event.locals.DB, event.locals.session.id);

                passed = true;
            } else {
                return setError(form, 'recoveryCode', 'Incorrect Recovery Code');
            }
        }

        if (!passed && form.data.mfa) {
            if (await verifyUserOTP(event.locals.DB, event.locals.user.id, form.data.mfa)) {
                passed = true;
            } else {
                return setError(form, 'mfa', 'Incorrect 2FA Token');
            }
        }

        // somewhat redundant check, but better safe than sorry
        if (passed) {
            await setSessionAsMFAVerified(event.locals.DB, event.locals.session.id);
            clearReturnPathCookie(event.cookies);
            redirect(303, returnPath);
        }
    }
};

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session || !locals.user) {
        redirect(303, route('/auth/sign-in'));
    }

    if (locals.session.mfaVerified === null) {
        // user has no mfa
        redirect(303, route('/'));
    }

    return {
        form: await superValidate(zod(mfaFormSchema), {
            defaults: {
                mfa: '',
                recoveryCode: ''
            }
        })
    };
};
