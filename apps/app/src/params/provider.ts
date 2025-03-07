import type { ParamMatcher } from '@sveltejs/kit';

const PROVIDER_PATTERN = /^[a-z]$/;

/**
 * # WARNING
 *
 * if Auth0 or 42 Schools is added to the allowed
 * list of matchers, this regex will need to be updated
 * to include those numbers.
 */
export const match = ((param: string) => PROVIDER_PATTERN.test(param)) satisfies ParamMatcher;
