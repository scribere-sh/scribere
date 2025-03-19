<script lang="ts">
    import type { LayoutProps } from './$types';

    const { children }: LayoutProps = $props();
</script>

<div class="grid h-screen w-screen place-items-center">
    {@render children()}
</div>
