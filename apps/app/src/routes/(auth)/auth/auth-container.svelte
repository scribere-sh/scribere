<script lang="ts">
    import type { Snippet } from 'svelte';

    const {
        children,
    }: {
        children: Snippet<[]>;
    } = $props();
</script>

<main class="flex h-full w-screen flex-col items-center justify-center">
    {@render children?.()}
</main>
