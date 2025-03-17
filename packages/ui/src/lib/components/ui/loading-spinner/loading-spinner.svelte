<script lang="ts" module>
    export type SpinnerState = 'loading' | 'complete' | 'error';
</script>

<script lang="ts">
    import CircleCheck from '@lucide/svelte/icons/circle-check';
    import CircleX from '@lucide/svelte/icons/circle-x';
    import type { SVGAttributes } from 'svelte/elements';

    import { cn } from '$lib/utils';

    type SpinnerProps = {
        state?: SpinnerState;
    } & SVGAttributes<SVGElement>;

    const {
        class: className,
        state = 'loading',

        ...rest
    }: SpinnerProps = $props();
</script>

{#if state === 'loading'}
    <svg
        class={cn(
            'aspect-square size-4 animate-[spin_2s_linear_infinite] stroke-current',
            className
        )}
        {...rest}
        viewBox="22 22 44 44"
    >
        <circle
            cx="44"
            cy="44"
            r="20.2"
            fill="none"
            stroke-width="3.2"
            class="animate-spinner-stroke stroke-inherit [stroke-linecap:round] [stroke-dasharray:80px,200px] [stroke-dashoffset:0]"
        ></circle>
    </svg>
{:else if state === 'complete'}
    <CircleCheck class={cn('aspect-square size-4 stroke-green-600', className)} />
{:else}
    <CircleX class={cn('aspect-square size-4 stroke-red-600', className)} />
{/if}
