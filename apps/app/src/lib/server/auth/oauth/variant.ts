import { route } from '$lib/ROUTES';

export type OAuth2ClientVariant = 'auth' | 'link';

export const getVariantCallbackURL = (provider: string, variant: OAuth2ClientVariant) => {
	if (variant === 'auth') return route('GET /oauth/[provider]/callback', { provider });
	else if (variant === 'link') return route('GET /oauth/[provider]/link', { provider });
	else throw new Error('Invalid OAuth2 Callback Path Variant');
};
