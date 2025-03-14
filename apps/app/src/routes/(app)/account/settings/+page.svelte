<script lang="ts">
    import type { PageProps } from './$types';

    import UpdateDisplayNameForm from './update-display-name.svelte';
    import UpdateHandle from './update-handle.svelte';
    import X from '@lucide/svelte/icons/x';

    import * as Avatar from '@scribere/ui/avatar';
    import * as Card from '@scribere/ui/card';
    import { Button } from '@scribere/ui/button';
    import { Separator } from '@scribere/ui/separator';
    import { Skeleton } from '@scribere/ui/skeleton';
    import { cn } from '@scribere/ui/utils';

    import { page } from '$app/stores';
    import { createScrollSpy } from '$client/scrollspy';
    import { trpc } from '$client/trpc';

    const { data }: PageProps = $props();

    const rpc = trpc($page);
    const utils = rpc.createUtils();

    const profileQuery = data.userProfileQuery();

    const scrollspy = createScrollSpy({ rootMargin: '-50% 0px' });
</script>

{#snippet SectionTitle(title: string)}
    <h1 class="mb-6 text-xl">{title}</h1>
{/snippet}

<Card.Root class="max-w-screen mx-auto mt-32 flex w-1/2 min-w-[60rem] flex-row">
    <aside class="w-96">
        <div class="flex aspect-square w-full flex-col items-center justify-center gap-2">
            <Avatar.Root class="size-32">
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

        <Separator />

        <nav class="sticky top-32 w-full p-6">
            {#each $scrollspy.targets as section (section.id)}
                {@const isActive = $scrollspy.isActive(section)}
                <Button
                    href={`#${section.id}`}
                    variant={isActive ? 'default' : 'ghost'}
                    size="dropdown"
                    class={cn('w-full')}
                >
                    {section.getAttribute('title') ?? 'Unititled'}
                </Button>
            {/each}
        </nav>
    </aside>

    <Separator orientation="vertical" />

    <main class="w-full">
        <Card.Content>
            <h1 class="text-3xl mb-6">Account Settings</h1>

            <section id="profile" title="Profile" use:scrollspy.spy>
                {@render SectionTitle('Profile')}

                <UpdateDisplayNameForm
                    current={$profileQuery.data?.displayName ?? '...'}
                    {utils}
                    {rpc}
                />

                <UpdateHandle current={$profileQuery.data?.handle ?? '...'} {utils} {rpc} />
            </section>

            <section id="password" title="Password" use:scrollspy.spy>
                {@render SectionTitle('Password')}
            </section>
        </Card.Content>
    </main>
</Card.Root>
