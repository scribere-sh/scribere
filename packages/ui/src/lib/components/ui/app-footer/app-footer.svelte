<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FooterVariant } from '.';

	import { FOOTER_VARIANTS } from '.';
	import { cn } from '$lib/utils';

	type FooterProps = {
		variant?: FooterVariant;
	} & HTMLAttributes<HTMLElement>;

	const {
		class: className,
		variant = 'normal',

		children,
		...rest
	}: FooterProps = $props();

	const heightClass = $state(FOOTER_VARIANTS[variant]);
</script>

<footer
	class={cn(
		'w-screen border-t border-border/40 bg-background/95 backdrop-blur transition-[height] supports-[backdrop-blur]:bg-background/50',
		heightClass,
		className
	)}
	{...rest}
>
	{@render children?.()}
</footer>
