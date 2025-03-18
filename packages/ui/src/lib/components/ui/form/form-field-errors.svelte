<script lang="ts">
    import * as FormPrimitive from 'formsnap';
    import type { WithoutChild } from 'bits-ui';
    import { fly } from 'svelte/transition';

    import { cn } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        class: className,
        errorClasses,
        children: childrenProp,
        ...restProps
    }: WithoutChild<FormPrimitive.FieldErrorsProps> & {
        errorClasses?: string | undefined | null;
    } = $props();
</script>

<FormPrimitive.FieldErrors
    bind:ref
    class={cn('text-xs font-medium text-destructive-text', className)}
    {...restProps}
>
    {#snippet children({ errors, errorProps })}
        {#if childrenProp}
            {@render childrenProp({ errors, errorProps })}
        {:else}
            {#each errors as error (error)}
                <div {...errorProps} in:fly={{ y: -10 }} class={cn('last:mb-2', errorClasses)}>
                    {error}
                </div>
            {/each}
        {/if}
    {/snippet}
</FormPrimitive.FieldErrors>
