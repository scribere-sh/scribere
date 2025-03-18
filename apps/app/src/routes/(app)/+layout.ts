import type { LayoutLoad } from './$types';

import { QueryClient } from '@tanstack/svelte-query';

export const load: LayoutLoad = async (event) => {
    const queryClient = new QueryClient();

    return {
        queryClient,
        ...event.data
    };
};
