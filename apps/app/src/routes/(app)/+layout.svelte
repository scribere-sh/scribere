<script lang="ts">
    import type { LayoutProps } from './$types';

    import { QueryClientProvider } from '@tanstack/svelte-query';
    import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
    import { onMount } from 'svelte';

    import { Sidebar } from '@scribere/ui/app-header';
    import { Toaster } from '@scribere/ui/sonner';
    import { ThemeToggle } from '@scribere/ui/theme-toggle';
    import { TooltipProvider } from '@scribere/ui/tooltip';

    import { openAppMessage } from '$client/messages';
    import Logo from '$lib/assets/logo.svg';
    import ProfileDropDown from '$lib/components/profile-drop-down.svelte';
    import { route } from '$routes';

    let { children, data }: LayoutProps = $props();

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

        <main class="h-screen w-full overflow-y-auto">
            {@render children()}
        </main>
    </TooltipProvider>
    <SvelteQueryDevtools />
</QueryClientProvider>
