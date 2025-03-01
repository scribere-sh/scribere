import type { PageServerLoad } from './$types';
import { renderConfirmationEmail } from '@scribere/email/confirmation';

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
