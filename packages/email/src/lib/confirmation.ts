import type { CreateEmailResponse } from 'resend';

import Handlebars from 'handlebars';
import EmailConfirmationTemplate from './templates/emailConfirmation.handlebars?raw';

import { Resend } from 'resend';

export interface SendEmailConfirmationEmailProps {
	api_key: string;
	verification_url: string;

	from: {
		name: string;
		email: string;
	};

	to: {
		name: string;
		email: string;
	};
}

const template = Handlebars.compile(EmailConfirmationTemplate);

export const renderConfirmationEmail = (
	props: Pick<SendEmailConfirmationEmailProps, 'to' | 'verification_url'>
): string => {
	return template(props);
};

export const sendEmailConfirmationEmail = async (
	props: SendEmailConfirmationEmailProps
): Promise<CreateEmailResponse> => {
	const { api_key } = props;

	const resend = new Resend(api_key);

	const payload = renderConfirmationEmail(props);

	return await resend.emails.send({
		from: `${props.from.name} <${props.from.email}>`,
		to: props.to.email,
		subject: 'Verify your email',

		html: payload
	});
};
