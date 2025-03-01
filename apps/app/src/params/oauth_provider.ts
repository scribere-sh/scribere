import { ValidProviderList, type ValidProvider } from '$lib/oauth';

import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is ValidProvider => {
	return ValidProviderList.includes(param);
}) satisfies ParamMatcher;
