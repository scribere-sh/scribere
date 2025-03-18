import PasswordResetAlertTemplate from './templates/passwordResetAlertTemplate.mustache?raw';
import Mustache from 'mustache';

import type { EmailSendResult } from '$lib';

export interface PasswordResetAlertProps {
    apiKey: string;

    from: {
        name: string;
        email: string;
    };

    to: {
        name: string;
        email: string;
    };
}

export const renderPasswordResetAlertEmail = (props: Pick<PasswordResetAlertProps, 'to'>) => {
    return Mustache.render(PasswordResetAlertTemplate, props);
};

export const sendPasswordResetAlertEmail = async (
    props: PasswordResetAlertProps
): Promise<EmailSendResult> => {
    const { apiKey, from, to } = props;

    const emailText = renderPasswordResetAlertEmail(props);
    const payload = {
        from: `${from.name} <${from.email}>`,
        to: to.email,
        subject: 'Your password has been reset!',

        html: emailText
    };

    const response = await fetch(`https://api.resend.com/emails`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    return (await response.json()) as EmailSendResult;
};
