<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    import { cn } from '$lib/utils';

    const { class: className, children, ...rest }: HTMLAttributes<HTMLElement> = $props();
</script>

<header
    class={cn(
        'sticky left-0 flex h-screen w-24 flex-col items-center justify-between border-r bg-card py-4 xl:py-0',
        className
    )}
    {...rest}
>
    {@render children?.()}
</header>
