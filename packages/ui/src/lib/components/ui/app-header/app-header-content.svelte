<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	const {
		class: className,

		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class={cn(
		'mx-auto flex h-full max-w-full flex-row items-center justify-between bg-transparent px-4 xl:max-w-screen-xl xl:px-0',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
