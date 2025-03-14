import type { PageLoad, PageParentData } from './$types';

import { trpc } from '$trpc-client';

export const load: PageLoad = async (event) => {
    const { queryClient } = (await event.parent()) as PageParentData;
    const rpc = trpc(event, queryClient);

    return {
        userOAuthSettings: await rpc.account.settings.loadOAuthSettings.createServerQuery(),
        userProfileQuery: await rpc.account.profile.loadCurrentUserProfile.createServerQuery(),

        ...event.data
    };
};
