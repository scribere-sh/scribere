<script lang="ts">
    import type { LayoutProps } from './$types';

    import { ModeWatcher } from 'mode-watcher';

    const { children }: LayoutProps = $props();
</script>

<ModeWatcher defaultMode="system" />

{@render children()}
