<script lang="ts">
    import LogOut from '@lucide/svelte/icons/log-out';
    import Settings from '@lucide/svelte/icons/settings';
    import User from '@lucide/svelte/icons/user';
    import X from '@lucide/svelte/icons/x';

    import * as Avatar from '@scribere/ui/avatar';
    import * as DropdownMenu from '@scribere/ui/dropdown-menu';
    import { Button } from '@scribere/ui/button';
    import { LoadingSpinner } from '@scribere/ui/loading-spinner';
    import { Skeleton } from '@scribere/ui/skeleton';

    import { page } from '$app/stores';
    import { trpc } from '$client/trpc';
    import { route } from '$routes';

    const displayInitials = (s: string) => {
        return s
            .split(' ')
            .map((s) => s[0])
            .join('')
            .substring(0, 3);
    };

    const close = () => {
        open = false;
    };

    let open = $state(false);

    const rpc = trpc($page);
    const currentUserProfile = rpc.account.profile.loadCurrentUserProfile.createQuery();
</script>

<DropdownMenu.Root bind:open>
    <DropdownMenu.Trigger class="grid aspect-square w-full place-items-center">
        <Avatar.Root>
            <Avatar.Fallback>
                {#if $currentUserProfile.isSuccess}
                    {displayInitials($currentUserProfile.data?.displayName ?? '. .')}
                {:else if $currentUserProfile.isError}
                    <X class="text-destructive-foreground" />
                {:else}
                    <LoadingSpinner />
                {/if}
            </Avatar.Fallback>
        </Avatar.Root>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content side="right" align="end" alignOffset={3} class="w-[350px]">
        <DropdownMenu.Label>
            <div class="flex flex-row justify-start">
                <Avatar.Root class="mr-4 aspect-square">
                    <Avatar.Fallback>
                        {#if $currentUserProfile.isSuccess}
                            {displayInitials($currentUserProfile.data?.displayName ?? '. .')}
                        {:else if $currentUserProfile.isError}
                            <X class="text-destructive-foreground" />
                        {:else}
                            <LoadingSpinner />
                        {/if}
                    </Avatar.Fallback>
                </Avatar.Root>
                <div class="w-full">
                    {#if $currentUserProfile.isSuccess}
                        <div>{$currentUserProfile.data?.displayName ?? 'Loading'}</div>
                        <div class="text-sm text-muted-foreground">
                            @{$currentUserProfile.data?.handle ?? 'Loading'}
                        </div>
                    {:else}
                        <Skeleton class="mb-2 h-4 w-[80%]" />
                        <Skeleton class="h-3 w-1/3" />
                    {/if}
                </div>
            </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
            <DropdownMenu.GroupHeading>Account</DropdownMenu.GroupHeading>
            <Button
                size="dropdown-inset"
                variant="ghost"
                href={route('/account/profile')}
                onclick={close}
            >
                <User /> Profile
            </Button>
            <Button
                size="dropdown-inset"
                variant="ghost"
                href={route('/account/settings')}
                onclick={close}
            >
                <Settings /> Settings
            </Button>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <Button
            size="dropdown"
            variant="destructive-ghost"
            class="px-4"
            href={route('GET /auth/sign-out')}
            onclick={close}
        >
            <LogOut /> Sign Out
        </Button>
    </DropdownMenu.Content>
</DropdownMenu.Root>
