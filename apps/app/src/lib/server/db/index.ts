import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/libsql';

export const DB = drizzle({
	connection: {
		url: env.TURSO_URL,
		authToken: env.TURSO_AUTH_TOKEN
	},
	logger: {
		logQuery: console.info
	}
});
