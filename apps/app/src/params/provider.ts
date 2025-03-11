import type { ParamMatcher } from '@sveltejs/kit';

const PROVIDER_PATTERN = /^[a-z0-9]+$/;

export const match = ((param: string) => PROVIDER_PATTERN.test(param)) satisfies ParamMatcher;
