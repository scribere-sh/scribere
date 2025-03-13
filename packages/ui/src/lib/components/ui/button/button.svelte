<script lang="ts" module>
    import type { WithElementRef } from 'bits-ui';
    import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
    import { tv, type VariantProps } from 'tailwind-variants';

    /**
     * Can be used for turning any element into a button, works with trigger elements
     * for drop-downs, tooltips, etc.
     */
    export const buttonVariants = tv({
        base: 'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                'destructive-ghost': 'hover:bg-destructive/90 hover:text-destructive-foreground',
                outline:
                    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline'
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
                dropdown: 'h-9 w-full justify-start px-3',
                'dropdown-inset': 'h-9 w-full justify-start pl-8 pr-3'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    });

    export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
    export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

    export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
        WithElementRef<HTMLAnchorAttributes> & {
            variant?: ButtonVariant;
            size?: ButtonSize;
        };
</script>

<script lang="ts">
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
