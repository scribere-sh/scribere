<script lang="ts">
    import { type ButtonProps, buttonVariants } from '.';

    import { cn } from '$lib/utils.js';

    let {
        class: className,
        variant = 'default',
        size = 'default',
        ref = $bindable(null),
        href = undefined,
        type = 'button',
        children,
        ...restProps
    }: ButtonProps = $props();
</script>

<!--

    @component

    The button components is all variants and possible combinations of a button in one.

    Adding the `href` property will cause it to switch from a `<button>` element to an
    `<a>` element.

 -->

{#if href}
    <a
        bind:this={ref}
        class={cn(buttonVariants({ variant, size }), className)}
        {href}
        {...restProps}
    >
        {@render children?.()}
    </a>
{:else}
    <button
        bind:this={ref}
        class={cn(buttonVariants({ variant, size }), className)}
        {type}
        {...restProps}
    >
        {@render children?.()}
    </button>
{/if}
