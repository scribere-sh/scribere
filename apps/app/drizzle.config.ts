import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config();

export default defineConfig({
	dialect: 'turso',
	schema: './src/lib/server/db/tables.ts',
	out: './drizzle',
	dbCredentials: {
		url: process.env.TURSO_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN
	}
});
