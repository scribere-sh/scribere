import EmailValidationTemplate from './templates/emailValidateTemplate.mustache?raw';
import Mustache from 'mustache';

import type { EmailSendResult } from '$lib';

export interface ValidateEmailProps {
    apiKey: string;
    validationUrl: string;

    from: {
        name: string;
        email: string;
    };

    to: {
        name: string;
        email: string;
    };
}

export const renderValidationEmail = (
    props: Pick<ValidateEmailProps, 'to' | 'validationUrl'>
): string => {
    return Mustache.render(EmailValidationTemplate, props);
};

export const sendValidationEmail = async (props: ValidateEmailProps): Promise<EmailSendResult> => {
    const { apiKey, from, to } = props;

    const emailText = renderValidationEmail(props);
    const payload = {
        from: `${from.name} <${from.email}>`,
        to: to.email,
        subject: 'Verify your email',

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
