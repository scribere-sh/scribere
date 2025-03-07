import type { Session } from '$lib/server/auth/session';
import type { User } from '$lib/server/auth/user';

import type { R2Bucket, RateLimit, Fetcher } from '@cloudflare/workers-types';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			R2: R2Bucket;
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
				RATE_LIMITER: RateLimit;
                ARGON2: Fetcher;
			};
		}
	}
}

export {};
