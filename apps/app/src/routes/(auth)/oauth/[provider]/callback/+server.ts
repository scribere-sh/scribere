import type { RequestHandler } from './$types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = ((event) => {
	return new Response(null);
}) satisfies RequestHandler;
