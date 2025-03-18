import ResetEmailTemplate from './templates/resetPasswordTemplate.mustache?raw';
import Mustache from 'mustache';

import type { EmailSendResult } from '$lib';

export interface ResetPasswordProps {
    apiKey: string;
    resetUrl: string;

    from: {
        name: string;
        email: string;
    };

    to: {
        name: string;
        email: string;
    };
}

export const renderResetPasswordEmail = (props: Pick<ResetPasswordProps, 'to' | 'resetUrl'>) => {
    return Mustache.render(ResetEmailTemplate, props);
};

export const sendResetPasswordEmail = async (
    props: ResetPasswordProps
): Promise<EmailSendResult> => {
    const { apiKey, from, to } = props;

    const emailText = renderResetPasswordEmail(props);
    const payload = {
        from: `${from.name} <${from.email}>`,
        to: to.email,
        subject: 'Reset your Password',

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
