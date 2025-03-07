import type { Handle } from '@sveltejs/kit';

/**
 * TODO: how do we rate limit session-less users
 */
export const applyRateLimiting: Handle = async ({ event, resolve }) => {
	if (event.locals.session) {
		const { success } = await event.platform!.env.RATE_LIMITER.limit({
			key: event.locals.session.id
		});

		if (!success) {
			return new Response(null, {
				status: 429
			});
		}
	}

	return await resolve(event);
};
