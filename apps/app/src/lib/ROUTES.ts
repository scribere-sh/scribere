/* eslint-disable */
/**
 * This file was generated by 'vite-plugin-kit-routes'
 *
 *      >> DO NOT EDIT THIS FILE MANUALLY <<
 */

/**
 * PAGES
 */
export const PAGES = {
    '/': `/`,
    '/account/profile': `/account/profile`,
    '/account/settings': `/account/settings`,
    '/debug': `/debug`,
    '/debug/editor': `/debug/editor`,
    '/auth/forgot-password': `/auth/forgot-password`,
    '/auth/mfa': `/auth/mfa`,
    '/auth/reset-password': `/auth/reset-password`,
    '/auth/sign-in': `/auth/sign-in`,
    '/auth/sign-up': `/auth/sign-up`
};

/**
 * SERVERS
 */
export const SERVERS = {
    'POST /api/assets': `/api/assets`,
    'PUT /api/assets': `/api/assets`,
    'GET /api/assets': `/api/assets`,
    'DELETE /api/assets': `/api/assets`,
    'GET /auth/sign-out': `/auth/sign-out`,
    'GET /auth/verify-email': `/auth/verify-email`,
    'GET /oauth/[provider]': (params: { provider: string | number }) => {
        return `/oauth/${params['provider']}`;
    },
    'GET /oauth/[provider]/callback': (params: { provider: string | number }) => {
        return `/oauth/${params['provider']}/callback`;
    },
    'GET /robots.txt': `/robots.txt`
};

/**
 * ACTIONS
 */
export const ACTIONS = {
    'link-oauth /account/settings': `/account/settings?/link-oauth`,
    'unlink-oauth /account/settings': `/account/settings?/unlink-oauth`,
    'update-password /account/settings': `/account/settings?/update-password`,
    'default /auth/forgot-password': `/auth/forgot-password`,
    'default /auth/mfa': `/auth/mfa`,
    'default /auth/reset-password': `/auth/reset-password`,
    'default /auth/sign-in': `/auth/sign-in`,
    'default /auth/sign-up': `/auth/sign-up`
};

/**
 * LINKS
 */
export const LINKS = {};

type ParamValue = string | number | undefined;

/**
 * Append search params to a string
 */
export const appendSp = (
    sp?: Record<string, ParamValue | ParamValue[]>,
    prefix: '?' | '&' = '?'
) => {
    if (sp === undefined) return '';

    const params = new URLSearchParams();
    const append = (n: string, v: ParamValue) => {
        if (v !== undefined) {
            params.append(n, String(v));
        }
    };

    let anchor = '';
    for (const [name, val] of Object.entries(sp)) {
        if (name === '__KIT_ROUTES_ANCHOR__' && val !== undefined) {
            anchor = `#${val}`;
            continue;
        }
        if (Array.isArray(val)) {
            for (const v of val) {
                append(name, v);
            }
        } else {
            append(name, val);
        }
    }

    const formatted = params.toString();
    if (formatted || anchor) {
        return `${prefix}${formatted}${anchor}`.replace('?#', '#');
    }
    return '';
};

/**
 * get the current search params
 *
 * Could be use like this:
 * ```
 * route("/cities", { page: 2 }, { ...currentSP() })
 * ```
 */
export const currentSp = () => {
    const params = new URLSearchParams(window.location.search);
    const record: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
        record[key] = value;
    }
    return record;
};

/* type helpers for route function */
type NonFunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
type FunctionKeys<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type FunctionParams<T> = T extends (...args: infer P) => any ? P : never;

const AllObjs = { ...PAGES, ...ACTIONS, ...SERVERS, ...LINKS };
type AllTypes = typeof AllObjs;

export type Routes = keyof AllTypes extends `${string}/${infer Route}`
    ? `/${Route}`
    : keyof AllTypes;
export const routes = [
    ...new Set(Object.keys(AllObjs).map((route) => /^\/.*|[^ ]?\/.*$/.exec(route)?.[0] ?? route))
] as Routes[];

/**
 * To be used like this:
 * ```ts
 * import { route } from './ROUTES'
 *
 * route('site_id', { id: 1 })
 * ```
 */
export function route<T extends FunctionKeys<AllTypes>>(
    key: T,
    ...params: FunctionParams<AllTypes[T]>
): string;
export function route<T extends NonFunctionKeys<AllTypes>>(key: T): string;
export function route<T extends keyof AllTypes>(key: T, ...params: any[]): string {
    if ((AllObjs[key] as any) instanceof Function) {
        const element = (AllObjs as any)[key] as (...args: any[]) => string;
        return element(...params);
    } else {
        return AllObjs[key] as string;
    }
}

/**
 * Add this type as a generic of the vite plugin `kitRoutes<KIT_ROUTES>`.
 *
 * Full example:
 * ```ts
 * import type { KIT_ROUTES } from '$lib/ROUTES'
 * import { kitRoutes } from 'vite-plugin-kit-routes'
 *
 * kitRoutes<KIT_ROUTES>({
 *  PAGES: {
 *    // here, key of object will be typed!
 *  }
 * })
 * ```
 */
export type KIT_ROUTES = {
    PAGES: {
        '/': never;
        '/account/profile': never;
        '/account/settings': never;
        '/debug': never;
        '/debug/editor': never;
        '/auth/forgot-password': never;
        '/auth/mfa': never;
        '/auth/reset-password': never;
        '/auth/sign-in': never;
        '/auth/sign-up': never;
    };
    SERVERS: {
        'POST /api/assets': never;
        'PUT /api/assets': never;
        'GET /api/assets': never;
        'DELETE /api/assets': never;
        'GET /auth/sign-out': never;
        'GET /auth/verify-email': never;
        'GET /oauth/[provider]': 'provider';
        'GET /oauth/[provider]/callback': 'provider';
        'GET /robots.txt': never;
    };
    ACTIONS: {
        'link-oauth /account/settings': never;
        'unlink-oauth /account/settings': never;
        'update-password /account/settings': never;
        'default /auth/forgot-password': never;
        'default /auth/mfa': never;
        'default /auth/reset-password': never;
        'default /auth/sign-in': never;
        'default /auth/sign-up': never;
    };
    LINKS: Record<string, never>;
    Params: { provider: never };
};
