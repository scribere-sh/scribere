import { drizzle } from 'drizzle-orm/libsql';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

export const DB = drizzle({
    connection: {
        url: env.TURSO_URL,
        authToken: env.TURSO_AUTH_TOKEN
    },
    logger: dev ? { logQuery: console.info } : undefined
});

export type DB = typeof DB | Parameters<Parameters<typeof DB.transaction>[0]>[0];
