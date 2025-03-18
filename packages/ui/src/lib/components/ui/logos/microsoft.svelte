<script lang="ts">
    import type { SVGAttributes } from 'svelte/elements';

    import { cn } from '$lib/utils';

    const {
        class: className,

        ...rest
    }: SVGAttributes<SVGElement> = $props();
</script>

<svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    class={cn('size-6', className)}
    {...rest}
>
    <title>Microsoft</title>
    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
    <path fill="#f35325" d="M1 1h10v10H1z" />
    <path fill="#81bc06" d="M12 1h10v10H12z" />
    <path fill="#05a6f0" d="M1 12h10v10H1z" />
    <path fill="#ffba08" d="M12 12h10v10H12z" />
</svg>
