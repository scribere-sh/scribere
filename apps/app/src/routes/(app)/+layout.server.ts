import type { LayoutServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

import { setReturnPathCookie } from '$auth';

import { APP_MESSAGE_VARIANTS } from '$client/messages';
import { route } from '$routes';

export const load: LayoutServerLoad = async (event) => {
    if (!event.locals.session || !event.locals.user) {
        setReturnPathCookie(event.cookies, event.url.pathname);
    }

    if (!event.locals.session || !event.locals.user) {
        redirect(303, route('/auth/sign-in'));
    }

    if (event.locals.session.mfaVerified === false) {
        redirect(303, route('/auth/mfa'));
    }

    const message = event.cookies.get('message');
    if (message)
        event.cookies.delete('message', {
            path: '/'
        });

    return {
        message: APP_MESSAGE_VARIANTS.includes(message ?? '') ? message : undefined,
        user: event.locals.user
    };
};
