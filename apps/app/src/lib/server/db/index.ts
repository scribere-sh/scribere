import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

let cacheDB: LibSQLDatabase;

export const DB = () => {
    if (!cacheDB)
        cacheDB = drizzle({
            connection: {
                url: env.TURSO_URL,
                authToken: env.TURSO_AUTH_TOKEN
            },
            logger: dev ? { logQuery: console.info } : undefined
        });
    return cacheDB;
};

export type DB = LibSQLDatabase | Parameters<Parameters<LibSQLDatabase['transaction']>[0]>[0];
