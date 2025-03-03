<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { HeaderVariant } from '.';

	import { cn } from '$lib/utils';
	import { HEADER_VARIANTS } from '.';

	type HeaderProps = {
		variant?: HeaderVariant;
	} & HTMLAttributes<HTMLElement>;

	const {
		class: className,
		variant = 'normal',

		children,
		...rest
	}: HeaderProps = $props();

	let heightClass = $state(HEADER_VARIANTS[variant]);
</script>

<header
	class={cn(
		'sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur transition-[height] supports-[backdrop-blur]:bg-background/50',
		heightClass,
		className
	)}
	{...rest}
>
	{@render children?.()}
</header>
