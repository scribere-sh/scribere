import type { PageServerLoad } from './$types';

import { renderValidationEmail } from '@scribere/email/validateEmail';

export const load = (() => {
    return {
        rendered: renderValidationEmail({
            to: {
                email: 'ha',
                name: 'fda',
            },
            validationUrl: 'https://google.com',
        }),
    };
}) satisfies PageServerLoad;
