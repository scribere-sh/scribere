<script lang="ts">
    import type { LayoutProps } from './$types';

    import { QueryClientProvider } from '@tanstack/svelte-query';
    import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
    import { onMount } from 'svelte';

    import * as Header from '@scribere/ui/app-header';
    import { Toaster } from '@scribere/ui/sonner';

    import Logo from "$lib/assets/logo.svg"

    import { openAppMessage } from '$client/messages';
    import ProfileDropDown from '$lib/components/profile-drop-down.svelte';
    import { route } from '$routes';

    let { children, data }: LayoutProps = $props();

    onMount(() => {
        openAppMessage(data.message);
    });
</script>

<Toaster richColors closeButton position="bottom-right" />

<QueryClientProvider client={data.queryClient}>
    <Header.Root>
        <Header.Content>
            <a class="text-3xl text-primary no-underline hover:underline" href={route('/')}>
                <img class="h-12 brightness-90 dark:filter-none" src={Logo} alt="Scribere Logo">
            </a>

            <ProfileDropDown />
        </Header.Content>
    </Header.Root>

    {@render children()}
    <SvelteQueryDevtools />
</QueryClientProvider>
