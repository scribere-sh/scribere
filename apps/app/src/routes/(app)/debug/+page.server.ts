import type { PageServerLoad } from './$types';

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
import { renderPasswordResetAlertEmail } from '@scribere/email/alertPasswortReset';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { renderResetPasswordEmail } from '@scribere/email/resetPassword';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { renderValidationEmail } from '@scribere/email/validateEmail';

export const load = (() => {
    return {
        rendered: renderPasswordResetAlertEmail({
            to: {
                email: 'ha',
                name: 'fda'
            },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            validationUrl: 'https://google.com',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            resetUrl: 'https://google.com'
        })
    };
}) satisfies PageServerLoad;
