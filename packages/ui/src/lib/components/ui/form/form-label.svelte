<script lang="ts">
    import * as FormPrimitive from 'formsnap';
    import type { WithoutChild } from 'bits-ui';

    import { Label } from '$lib/components/ui/label/index.js';
    import { cn } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        children,
        class: className,
        ...restProps
    }: WithoutChild<FormPrimitive.LabelProps> = $props();
</script>

<!-- red with errors 'data-[fs-error]:text-destructive' -->

<FormPrimitive.Label {...restProps} bind:ref>
    {#snippet child({ props })}
        <Label {...props} class={cn('font-semibold', className)}>
            {@render children?.()}
        </Label>
    {/snippet}
</FormPrimitive.Label>
