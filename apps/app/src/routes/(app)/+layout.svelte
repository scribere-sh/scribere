<script lang="ts">
    import type { LayoutProps } from './$types';

    import { QueryClientProvider } from '@tanstack/svelte-query';
    import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
    import { onMount } from 'svelte';

    import * as Header from '@scribere/ui/app-header';
    import { Toaster } from '@scribere/ui/sonner';

    import { openAppMessage } from '$client/messages';
    import ProfileDropDown from '$lib/components/profile-drop-down.svelte';

    let { children, data }: LayoutProps = $props();

    onMount(() => {
        openAppMessage(data.message);
    });
</script>

<Toaster richColors closeButton position="bottom-right" />

<QueryClientProvider client={data.queryClient}>
    <Header.Root>
        <Header.Content>
            <h1 class="text-3xl">Scribere</h1>

            <ProfileDropDown user={data.user} />
        </Header.Content>
    </Header.Root>

    {@render children()}
    <SvelteQueryDevtools />
</QueryClientProvider>
