import type { LayoutServerLoad } from './$types';

import { redirect } from '@sveltejs/kit';

import { MESSAGE_VARIANTS } from '$client/messages';
import { route } from '$routes';

export const load: LayoutServerLoad = ({ cookies, locals }) => {
    const message = cookies.get('message');
    cookies.delete('message', {
        path: '/'
    });

    if (locals.user && locals.session) {
        // why are we logging in again?
        redirect(302, route('/'));
    }

    return {
        message: MESSAGE_VARIANTS.includes(message ?? '') ? message : undefined
    };
};
