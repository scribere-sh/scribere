import type { PageLoad, PageParentData } from './$types';

import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { resetPasswordAccountSettingsSchema } from '$client/forms';
import { trpc } from '$trpc-client';

export const load: PageLoad = async (event) => {
    const { queryClient } = (await event.parent()) as PageParentData;
    const rpc = trpc(event, queryClient);

    return {
        userOAuthSettings: await rpc.account.settings.loadAuthSettings.createServerQuery(
            undefined,
            {
                ssr: false
            }
        ),
        userProfileQuery: await rpc.account.profile.loadCurrentUserProfile.createServerQuery(
            undefined,
            {
                ssr: false
            }
        ),

        updatePasswordForm: await superValidate(zod(resetPasswordAccountSettingsSchema)),

        ...event.data
    };
};
