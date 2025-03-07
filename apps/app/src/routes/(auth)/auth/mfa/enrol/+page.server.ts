import type { Actions, PageServerLoad } from "./$types"

import { route } from "$lib/ROUTES";
import { redirect } from "@sveltejs/kit";

import { renderSVG } from "uqr";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import { userHasTOTP, generateTOTPKey, generateTOTPEnrollmentURL, verifyOTP, enrolUserWithTOTP } from "$lib/server/auth/mfa";
import { mfaEnrollmentFormSchema } from "$lib/client/forms";
import { setSessionAsMFAVerified } from "$lib/server/auth/session";

export const actions: Actions = {
    default: async (event) => {
        if (!event.locals.session || !event.locals.user) {
            redirect(302, route('/auth/log-in'));
        }

        const form = await superValidate(event, zod(mfaEnrollmentFormSchema));
        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        if (verifyOTP(form.data.challenge, form.data.mfa)) {
            await enrolUserWithTOTP(event.locals.user.id, form.data.challenge, form.data.mfa);
            await setSessionAsMFAVerified(event.locals.session.id);

            redirect(302, route('/'));
        } else {
            return setError(form, 'mfa', 'Incorrect 2FA Code')
        }

        console.log(form.data);
    }
}


export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.session || !locals.user) {
        redirect(302, route('/auth/log-in'));
    }

    if (await userHasTOTP(locals.user.id)) {
        redirect(302, route('/'));
    }

    const challenge = generateTOTPKey();
    const enrolmentUrl = generateTOTPEnrollmentURL(challenge, `${locals.user.givenName} ${locals.user.familyName}`);

    const encrollmentSVG = renderSVG(enrolmentUrl, {
        ecc: "M"
    });

    return {
        encrollmentSVG,
        enrolmentUrl,
        challenge,
        form: await superValidate(zod(mfaEnrollmentFormSchema))
    }
};
