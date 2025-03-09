import type { PageLoad, PageParentData } from './$types';

import { trpc } from '$lib/client/trpc';

export const load: PageLoad = async (event) => {
	const { queryClient } = (await event.parent()) as PageParentData;
	const rpc = trpc(event, queryClient);

	return {
		userProfileQuery: await rpc.account.profile.loadCurrentUserProfile.createServerQuery()
	};
};
