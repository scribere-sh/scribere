import { D1Database, R2Bucket } from '@cloudflare/workers-types';
import { DrizzleD1Database } from 'drizzle-orm/d1';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			DB: DrizzleD1Database;
			R2: R2Bucket;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				RESEND_API_KEY: string;
				SENDER_EMAIL: string;
				SENDER_NAME: string;

				DB: D1Database;
				R2: R2Bucket;
			};
		}
	}
}

export {};
