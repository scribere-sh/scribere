import '../../app.pcss';

import type { LayoutLoad } from './$types';

import { QueryClient } from '@tanstack/svelte-query';

export const load = (async () => {
	const queryClient = new QueryClient();

	return {
		queryClient
	};
}) satisfies LayoutLoad;
