/**
 * When a user logs out we can use this to
 * suggest a login method sooner.
 *
 * Optional feature but we should set it in case its
 * used later.
 */
export const LAST_LOGIN_METHOD_COOKIE_NAME = '__last_used_login_method';

/**
 * This stupid type exists solely and exclusively to get
 * eslint/svelte/whatever is screaming to SHUT UP
 *
 * (used in form generators)
 */
export type PropsObj = { props: Record<string, unknown> };
