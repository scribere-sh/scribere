import type { LayoutServerLoad } from "./$types";

import { route } from "$lib/ROUTES";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({locals}) => {
    if (!locals.session || !locals.user) {
        redirect(302, route('/auth/log-in'));
    }

    if (!locals.session.mfaVerified) {
        redirect(302, route('/auth/mfa'));
    }
}
