<script lang="ts">
    import type { PageProps } from './$types';

    import MFA from './mfa.svelte';
    import UpdateDisplayNameForm from './update-display-name.svelte';
    import UpdateHandle from './update-handle.svelte';
    import UpdatePasswordForm from './update-password-form.svelte';
    import X from '@lucide/svelte/icons/x';
    import { derived } from 'svelte/store';

    import * as Avatar from '@scribere/ui/avatar';
    import * as Card from '@scribere/ui/card';
    import { Button } from '@scribere/ui/button';
    import { Separator } from '@scribere/ui/separator';
    import { Skeleton } from '@scribere/ui/skeleton';
    import { cn } from '@scribere/ui/utils';

    import { page } from '$app/stores';
    import { METHODS } from '$client/oauth-methods';
    import { createScrollSpy } from '$client/scrollspy';
    import { trpc } from '$client/trpc';

    const { data }: PageProps = $props();

    const rpc = trpc($page);
    const utils = rpc.createUtils();

    const profileQuery = data.userProfileQuery();
    const settingsQuery = data.userOAuthSettings();

    const scrollspy = createScrollSpy({ rootMargin: '-50% 0px' });

    const isError = derived([profileQuery, settingsQuery], (a) =>
        a.map((q) => q.isError).reduce((prev, curr) => prev || curr, false)
    );
</script>

{#snippet SectionTitle(title: string)}
    <h1 class="mb-6 text-2xl">{title}</h1>
{/snippet}

<Card.Root class="max-w-screen mx-auto my-32 flex w-1/2 min-w-[60rem] flex-row">
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

        <nav class="sticky top-[var(--header-height)] w-full p-6">
            {#each $scrollspy.targets as section (section.id)}
                {@const isActive = $scrollspy.isActive(section)}
                <Button
                    href={`#${section.id}`}
                    variant={isActive === true ? 'default' : 'ghost'}
                    size="dropdown"
                    class={cn('w-full')}
                >
                    {section.getAttribute('title') ?? 'Untitled'}
                </Button>
            {/each}
        </nav>
    </aside>

    <Separator orientation="vertical" />

    <main class="w-full">
        <Card.Content>
            <h1 class="mb-12 text-3xl">Account Settings</h1>

            <section
                class="pb-4 mb-px [scroll-margin-top:calc(var(--header-height)+2rem)]"
                id="profile"
                title="Profile"
                use:scrollspy.spy
            >
                {@render SectionTitle('Profile')}

                <UpdateDisplayNameForm
                    current={$profileQuery.data?.displayName ?? '...'}
                    {utils}
                    {rpc}
                    disabled={$settingsQuery.isLoading || $profileQuery.isLoading}
                    isError={$isError}
                />

                <UpdateHandle
                    current={$profileQuery.data?.handle ?? '...'}
                    {utils}
                    {rpc}
                    disabled={$settingsQuery.isLoading || $profileQuery.isLoading}
                    isError={$isError}
                />
            </section>

            <section
                class="pb-4 mb-px [scroll-margin-top:calc(var(--header-height)+2rem)]"
                id="password"
                title="Password"
                use:scrollspy.spy
            >
                {@render SectionTitle('Password')}

                <UpdatePasswordForm form={data.updatePasswordForm} isError={$isError} disabled={$settingsQuery.isLoading || $profileQuery.isLoading} />
            </section>

            <section
                class="pb-4 mb-px [scroll-margin-top:calc(var(--header-height)+2rem)]"
                id="mfa"
                title="Multi-Factor Authentication"
                use:scrollspy.spy
            >
                {@render SectionTitle('Multi-Factor Authentication')}

                <MFA
                    {rpc}
                    {utils}
                    disabled={$settingsQuery.isLoading || $profileQuery.isLoading}
                    currentlyEnrolled={($settingsQuery.data?.mfaMethods ?? []).includes('totp')}
                    isError={$isError}
                />
            </section>

            <section
                class="[scroll-margin-top:calc(var(--header-height)+2rem)]"
                id="oauth-connections"
                title="OAuth Connections"
                use:scrollspy.spy
            >
                {@render SectionTitle('OAuth Connections')}

                {#each METHODS as method (method.id)}
                    {@const isLinked =
                        $settingsQuery.data?.oauthMethods.includes(method.id) ?? false}
                    {@const isActive = data.activeMethods.includes(method.id)}

                    <div
                        class="flex h-24 flex-row items-center border-b border-border px-6 last:border-b-0"
                    >
                        <div class="mr-6 grid h-full place-items-center">
                            <method.icon />
                        </div>

                        <div class="w-full">
                            {method.name}
                        </div>

                        <form
                            method="POST"
                            class="mr-12"
                            action={isLinked ? '?/unlink-oauth' : '?/link-oauth'}
                        >
                            <input type="hidden" name="provider" value={method.id} />
                            <Button
                                class="w-24"
                                variant={isLinked ? 'destructive' : 'default'}
                                type="submit"
                                disabled={!(isActive || isLinked) ||
                                    $settingsQuery.isLoading ||
                                    $profileQuery.isLoading || 
                                    $isError}
                            >
                                {method.disabled 
                                    ? "-" 
                                    : $settingsQuery.isLoading 
                                        ? '...' 
                                        : isLinked 
                                            ? 'Unlink' 
                                            : 'Link'
                                }
                            </Button>
                        </form>
                    </div>
                {/each}
            </section>
        </Card.Content>
    </main>
</Card.Root>
