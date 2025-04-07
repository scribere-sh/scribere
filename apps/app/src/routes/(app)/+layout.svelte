<script lang="ts">
    import type { LayoutProps } from './$types';

    import { QueryClientProvider } from '@tanstack/svelte-query';
    import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
    import { onMount } from 'svelte';

    import { Sidebar } from '@scribere/ui/app-header';
    import { Toaster } from '@scribere/ui/sonner';
    import { ThemeToggle } from '@scribere/ui/theme-toggle';
    import { TooltipProvider } from '@scribere/ui/tooltip';
    import { cn } from '@scribere/ui/utils';

    import { navigating } from '$app/state';
    import { openAppMessage } from '$client/messages';
    import Logo from '$lib/assets/logo.svg';
    import WavyThing from '$lib/assets/wavy-thing-3.svg';
    import ProfileDropDown from '$lib/components/profile-drop-down.svelte';
    import { route } from '$routes';

    let { children, data }: LayoutProps = $props();
    const isNavigating = $derived(navigating.to !== null);

    onMount(() => {
        openAppMessage(data.message);
    });
</script>

<Toaster richColors closeButton position="bottom-right" />

<QueryClientProvider client={data.queryClient}>
    <TooltipProvider>
        <Sidebar>
            <div class="w-full">
                <a
                    class="grid aspect-square w-full place-items-center text-3xl text-primary no-underline hover:underline"
                    href={route('/')}
                >
                    <img class="h-12" src={Logo} alt="Scribere Logo" />
                </a>
            </div>

            <div class="w-full">
                <div class="grid w-full place-items-center">
                    <ThemeToggle align="center" side="right" />
                </div>

                <ProfileDropDown />
            </div>
        </Sidebar>

        <main
            class="h-screen w-full overflow-y-auto bg-[length:98%] bg-center bg-no-repeat bg-blend-lighten"
            style:background-image={`url(${WavyThing})`}
        >
            {@render children()}
        </main>
    </TooltipProvider>
    <SvelteQueryDevtools />
</QueryClientProvider>

<div
    class={cn(
        'fixed left-0 top-0 z-50 h-1 w-screen -translate-y-1 transition-transform',
        isNavigating && 'translate-y-0'
    )}
>
    {#if isNavigating}
        <div class="h-full animate-loading-bar rounded bg-primary"></div>
    {/if}
</div>
