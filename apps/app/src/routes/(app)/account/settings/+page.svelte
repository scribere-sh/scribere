<script lang="ts">
    import type { PageProps } from './$types';

    import X from 'lucide-svelte/icons/x';

    import * as Avatar from '@scribere/ui/avatar';
    import * as Card from '@scribere/ui/card';
    import { Skeleton } from '@scribere/ui/skeleton';

    const { data }: PageProps = $props();

    const profileQuery = data.userProfileQuery();
</script>


<Card.Root class="mx-auto mt-32 w-1/2">
<div class="flex flex-row">
    <div class="aspect-[1/2] h-20 overflow-visible pl-8">
        <Avatar.Root class="size-44 -translate-y-20 border bg-card">
            {#if $profileQuery.isLoading}
                <Skeleton class="size-full" />
            {:else if $profileQuery.isSuccess}
                {@const data = $profileQuery.data}

                <Avatar.Image src="https://placehold.co/400x400" />

                <Avatar.Fallback class="text-2xl uppercase">
                    {data.displayName[0]}
                </Avatar.Fallback>
            {:else}
                <div class="grid size-full place-items-center">
                    <X class="size-8 text-destructive-text" />
                </div>
            {/if}
        </Avatar.Root>
    </div>
    <Card.Header class="flex h-20 w-full flex-row items-center justify-between">
        <div class="w-full">
        {#if $profileQuery.isLoading}
            <Skeleton class="my-1 h-6 w-[80%] rounded-full" />
            <Skeleton class="my-0.5 h-5 w-[40%] rounded-full" />
        {:else if $profileQuery.isSuccess}
            {@const data = $profileQuery.data}
            <Card.Title>
                <span class="text-2xl">{data.displayName}</span>
            </Card.Title>
            <Card.Description>@{data.handle}</Card.Description>
        {:else}
            <span class="text-2xl text-destructive-text">Failed to fetch profile</span>
        {/if}
    </div>
    </Card.Header>
</div>

<Card.Content>HEHEHEHA2</Card.Content>
</Card.Root>
