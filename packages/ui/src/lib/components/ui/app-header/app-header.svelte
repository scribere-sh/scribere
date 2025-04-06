<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    import { cn } from '$lib/utils';

    type HeaderProps = HTMLAttributes<HTMLElement>;

    const {
        class: className,

        children,
        ...rest
    }: HeaderProps = $props();
</script>

<header
    class={cn(
        'sticky top-0 z-50 h-header w-screen border-b border-border/40 bg-card/80 backdrop-blur transition-[height] supports-[backdrop-blur]:bg-card/50',
        className
    )}
    {...rest}
>
    {@render children?.()}
</header>
