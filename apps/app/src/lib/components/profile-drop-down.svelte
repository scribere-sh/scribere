<script lang="ts">
    import LogOut from 'lucide-svelte/icons/log-out';
    import Settings from 'lucide-svelte/icons/settings';
    import User from 'lucide-svelte/icons/user';

    import * as Avatar from '@scribere/ui/avatar';
    import * as DropdownMenu from '@scribere/ui/dropdown-menu';
    import { Button } from '@scribere/ui/button';

    import type { User as UserType } from '$auth/user';

    import { route } from '$routes';

    interface ProfileDropdownProps {
        user: UserType;
    }

    const { user }: ProfileDropdownProps = $props();

    const displayInitials = user.displayName
        .split(' ')
        .map((s) => s[0])
        .join('');

    const close = () => {
        open = false;
    };

    let open = $state(false);
</script>

<DropdownMenu.Root bind:open>
    <DropdownMenu.Trigger>
        <Avatar.Root>
            <Avatar.Fallback>
                {displayInitials}
            </Avatar.Fallback>
        </Avatar.Root>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end" class="w-[350px]">
        <DropdownMenu.Label>
            <div class="flex flex-row justify-start">
                <Avatar.Root class="mr-4 aspect-square">
                    <Avatar.Fallback>
                        {displayInitials}
                    </Avatar.Fallback>
                </Avatar.Root>
                <div>
                    <div>{user.displayName}</div>
                    <div class="text-sm text-muted-foreground">@{user.handle}</div>
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
