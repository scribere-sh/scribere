import type { Fetcher, R2Bucket } from '@cloudflare/workers-types';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

import type { Session } from '$auth/session';
import type { User } from '$auth/user';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            R2: R2Bucket;
            DB: LibSQLDatabase;

            session: Session | null;
            user: User | null;
        }
        // interface PageData {}
        // interface PageState {}
        interface Platform {
            env: {
                RESEND_API_KEY: string;
                SENDER_EMAIL: string;
                SENDER_NAME: string;

                R2: R2Bucket;
                ARGON2: Fetcher;
            };
        }
    }
}

export {};
