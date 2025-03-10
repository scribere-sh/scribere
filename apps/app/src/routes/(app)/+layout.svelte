<script lang="ts">
	import type { LayoutProps } from './$types';

	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	import * as Header from '@scribere/ui/app-header';

	let { children, data }: LayoutProps = $props();
</script>

<QueryClientProvider client={data.queryClient}>
	<Header.Root></Header.Root>

	{@render children()}
	<SvelteQueryDevtools />
</QueryClientProvider>
