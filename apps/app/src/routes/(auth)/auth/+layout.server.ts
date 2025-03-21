import type { LayoutServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

import { AUTH_MESSAGE_VARIANTS } from '$client/messages';
import { route } from '$routes';

export const load: LayoutServerLoad = ({ cookies, locals }) => {
    const message = cookies.get('message');
    if (message)
        cookies.delete('message', {
            path: '/'
        });

    if (
        locals.user &&
        locals.session &&
        // mfa can be true, false, or null
        //
        // true = MFA Available and Verified
        // false = MFA Available but not Verified
        // null = MFA Unavailable
        locals.session.mfaVerified !== false
    ) {
        // why are we logging in again?
        redirect(303, route('/'));
    }

    return {
        message: AUTH_MESSAGE_VARIANTS.includes(message ?? '') ? message : undefined,
        wavyThingIndex: Math.floor(Math.random() * 3)
    };
};
