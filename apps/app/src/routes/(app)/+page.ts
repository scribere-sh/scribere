import type { PageLoad, PageParentData } from './$types';

import { trpc } from '$lib/trpc';

const DEFAULT_NAME = 'Huddy Buddy'.trim();

export const load = (async (event) => {
	const { queryClient } = (await event.parent()) as PageParentData;
	const rpc = trpc(event, queryClient);

	const name = event.url.searchParams.get('name') ?? DEFAULT_NAME;

	return {
		name,
		nameQuery: await rpc.hello_world.createServerQuery({ name })
	};
}) satisfies PageLoad;
