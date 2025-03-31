<script lang="ts">
    import Moon from '@lucide/svelte/icons/moon';
    import Settings from '@lucide/svelte/icons/settings';
    import Sun from '@lucide/svelte/icons/sun';
    import type { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
    import { resetMode, setMode } from 'mode-watcher';

    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import { buttonVariants } from '$lib/components/ui/button';

    const props: DropdownMenuPrimitive.ContentProps = $props();
</script>

<!-- 
    @component

    This component allows us to quickly and easily setup a theme toggle the 
    saves to localstorage using {@link https://www.npmjs.com/package/mode-watcher | `mode-watcher`} 
-->

<DropdownMenu.Root>
    <!-- Theme Button -->
    <DropdownMenu.Trigger
        class={buttonVariants({
            variant: 'ghost',
            size: 'icon'
        })}
    >
        <Sun
            class="size-[1.2rem] rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"
        />
        <Moon
            class="absolute size-[1.2rem] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle Theme</span>
    </DropdownMenu.Trigger>
    <!-- Theme Options -->
    <DropdownMenu.Content {...props}>
        <DropdownMenu.Item onclick={() => setMode('light')}>
            <Sun size="0.8rem" class="mr-4" />&nbsp;Light
        </DropdownMenu.Item>
        <DropdownMenu.Item onclick={() => setMode('dark')}>
            <Moon size="0.8rem" class="mr-4" />&nbsp;Dark
        </DropdownMenu.Item>
        <DropdownMenu.Item onclick={resetMode}>
            <Settings size="0.8rem" class="mr-4" />&nbsp;System
        </DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
