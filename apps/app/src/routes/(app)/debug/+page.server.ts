import { renderValidationEmail } from '@scribere/email/validateEmail';
import type { PageServerLoad } from './$types';

export const load = (() => {
	return {
		rendered: renderValidationEmail({
			to: {
				email: 'ha',
				name: 'fda'
			},
			validationUrl: 'https://google.com'
		})
	};
}) satisfies PageServerLoad;
