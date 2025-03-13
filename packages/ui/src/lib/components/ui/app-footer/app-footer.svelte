<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    import { cn } from '$lib/utils';

    type FooterProps = HTMLAttributes<HTMLElement>;

    const {
        class: className,

        children,
        ...rest
    }: FooterProps = $props();
</script>

<footer
    class={cn(
        'h-footer w-screen border-t border-border/40 bg-background/95 backdrop-blur transition-[height] supports-[backdrop-blur]:bg-background/50',
        className
    )}
    {...rest}
>
    {@render children?.()}
</footer>
