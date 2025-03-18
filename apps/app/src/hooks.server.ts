import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';

import { deleteExpiredChallenges } from '$auth/reset-password';
import {
    deleteExpiredSessions,
    deleteSessionToken,
    SESSION_TOKEN_NAME,
    setSessionToken,
    validateSessionToken
} from '$auth/session';

import { building } from '$app/environment';
import { DB } from '$db';
import { TRPC_PATH } from '$trpc-client';
import { createContext } from '$trpc/context';
import router from '$trpc/router';

const apiRequireAuthHandle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/api')) {
        if (!event.locals.session || !event.locals.user) {
            return new Response(null, {
                status: 401
            });
        }
    }

    return resolve(event);
};

const validateSessionHandle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get(SESSION_TOKEN_NAME) ?? null;
    if (token === null) {
        event.locals.session = null;
        event.locals.user = null;
        return resolve(event);
    }

    const { session, user } = await validateSessionToken(token);
    if (session !== null) {
        setSessionToken(token, session.expiresAt);
    } else {
        deleteSessionToken();
    }

    event.locals.session = session;
    event.locals.user = user;

    return await resolve(event);
};

const injectDBHandle: Handle = async ({ event, resolve }) => {
    event.locals.DB = DB();

    return await resolve(event);
};

/**
 * Auto-delete expired sessions every 10 minutes
 */
setInterval(
    async () => {
        const db = DB();
        await db.transaction(async (tx_db) => {
            await deleteExpiredSessions(tx_db);
            await deleteExpiredChallenges(tx_db);
        });
    },
    10 * 60 * 1000
);

// because this is serverless, we can't guarantee it'll run long
// enough for the interval to run, so we improvise and run on
// service startup.
if (!building) {
    const db = DB();
    await db.transaction(async (tx_db) => {
        await deleteExpiredSessions(tx_db);
        await deleteExpiredChallenges(tx_db);
    });
}

export const handle: Handle = sequence(
    async ({ event, resolve }) => {
        if (!event.platform) {
            console.error(`event.platform IS MISSING!!!!!`);

            return new Response(null, {
                status: 500
            });
        }
        event.locals.R2 = event.platform!.env.R2;
        return resolve(event);
    },
    injectDBHandle,
    validateSessionHandle,
    apiRequireAuthHandle,
    createTRPCHandle({ router, createContext, url: TRPC_PATH })
);
