<script lang="ts">
	import type { LayoutProps } from './$types';

	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	let { children, data }: LayoutProps = $props();
</script>

<QueryClientProvider client={data.queryClient}>
	{@render children()}
	<SvelteQueryDevtools />
</QueryClientProvider>
