import type { PageServerLoad } from './$types';

const DEFAULT_NAME = 'Dick Head';

export const load = (async (event) => {
    const nameForQuery = event.locals.user?.displayName ?? DEFAULT_NAME;

    return {
        nameForQuery,
    };
}) satisfies PageServerLoad;
