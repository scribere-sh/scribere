<script lang="ts">
    import Dot from '@lucide/svelte/icons/dot';
    import type { WithElementRef } from 'bits-ui';
    import type { HTMLAttributes } from 'svelte/elements';

    let {
        ref = $bindable(null),
        children,
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} role="separator" {...restProps}>
    {#if children}
        {@render children?.()}
    {:else}
        <Dot />
    {/if}
</div>
