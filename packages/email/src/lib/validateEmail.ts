import type { CreateEmailResponse } from 'resend';

import Handlebars from 'handlebars';
import EmailConfirmationTemplate from './templates/emailValidateTemplate.handlebars?raw';

import { Resend } from 'resend';

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

const template = Handlebars.compile(EmailConfirmationTemplate);

export const renderValidationEmail = (
	props: Pick<ValidateEmailProps, 'to' | 'validationUrl'>
): string => {
	return template(props);
};

export const sendValidationEmail = async (
	props: ValidateEmailProps
): Promise<CreateEmailResponse> => {
	const { apiKey: api_key } = props;

	const resend = new Resend(api_key);

	const payload = renderValidationEmail(props);

	return await resend.emails.send({
		from: `${props.from.name} <${props.from.email}>`,
		to: props.to.email,
		subject: 'Verify your email',

		html: payload
	});
};
