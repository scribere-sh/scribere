<script lang="ts">
    import type { HTMLAnchorAttributes } from 'svelte/elements';

    import { cn } from '@scribere/ui/utils';

    const {
        href = '#main-content',
        tabindex = 0,
        class: className,

        children,
        ...rest
    }: HTMLAnchorAttributes = $props();
</script>

<a
    {href}
    {tabindex}
    class={cn(
        'absolute m-[-1px] size-[1px] overflow-hidden whitespace-nowrap border-0 p-0 underline [clip:rect(0,0,0,0)] [visibility:inherit]',
        'focus:left-0 focus:top-0 focus:z-[9999] focus:flex focus:h-12 focus:w-auto focus:items-center focus:border-4 focus:border-solid focus:border-foreground focus:bg-background focus:px-4 focus:py-0 focus:text-foreground focus:outline-none focus:[clip:auto]',
        className
    )}
    {...rest}
>
    {#if children}
        {@render children()}
    {:else}
        Skip to main content
    {/if}
</a>
