<script lang="ts">
    import type { Snippet } from 'svelte';

    import SkipToMain from '$lib/components/skip-to-main.svelte';

    const {
        children
    }: {
        children: Snippet<[]>;
    } = $props();
</script>

<main class="flex h-full w-screen flex-col items-center justify-center" tabindex="-1">
    <SkipToMain />
    {@render children?.()}
</main>
