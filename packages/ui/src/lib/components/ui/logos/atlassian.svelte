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
    viewBox="0 0 66 66"
    xmlns="http://www.w3.org/2000/svg"
    class={cn('size-6 fill-current', className)}
    {...rest}
>
    <title>Atlassian</title>
    
    <defs>
        <linearGradient xmlns="http://www.w3.org/2000/svg" id="linear-gradient" x1="28.540001" y1="69.489998" x2="11.41" y2="99.169998" gradientUnits="userSpaceOnUse" gradientTransform="translate(-0.0039818,-33.961454)">
            <stop offset="0" stop-color="#0052cc" id="stop4"/>
            <stop offset="0.92" stop-color="#2684ff" id="stop6"/>
          </linearGradient>
    </defs>

    <path 
        style="fill:url(#linear-gradient)" 
        d="m 19.636018,30.518546 a 1.88,1.88 0 0 0 -3.2,0.35 l -16.2299998,32.46 a 1.94,1.94 0 0 0 1.73,2.81 H 24.536018 a 1.87,1.87 0 0 0 1.74,-1.1 c 4.87,-10 1.92,-25.37 -6.64,-34.52 z"
    />
    <path 
        style="fill:#2684ff" 
        d="m 31.546018,1.038546 a 42.81,42.81 0 0 0 -2.5,42.27 l 10.95,21.73 a 1.94,1.94 0 0 0 1.73,1.08 h 22.6 a 2,2 0 0 0 1.67,-2.79 l -31.15,-62.29 a 1.83,1.83 0 0 0 -3.3,0 z" 
    />
</svg>
