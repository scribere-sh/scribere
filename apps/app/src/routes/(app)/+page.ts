import type { PageLoad, PageParentData } from './$types';

import { trpc } from '$trpc-client';

export const load = (async (event) => {
    const { queryClient } = (await event.parent()) as PageParentData;
    const rpc = trpc(event, queryClient);

    const name = event.data.nameForQuery;

    return {
        name,
        nameQuery: await rpc.hello_world.createServerQuery({ name }, { ssr: false }),
        rpc
    };
}) satisfies PageLoad;
