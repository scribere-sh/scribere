import { renderConfirmationEmail } from '@scribere/email/confirmation';
import type { PageServerLoad } from './$types';

export const load = (() => {
	return {
		rendered: renderConfirmationEmail({
			to: {
				email: 'ha',
				name: 'fda'
			},
			verification_url: 'https://google.com'
		})
	};
}) satisfies PageServerLoad;
