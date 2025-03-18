<script lang="ts" module>
    export const TOAST_DURATION_MS = 5000;
</script>

<script lang="ts">
    import { mode, systemPrefersMode } from 'mode-watcher';
    import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner';

    let restProps: SonnerProps = $props();
</script>

<Sonner
    theme={$mode ?? $systemPrefersMode}
    class="toaster group"
    toastOptions={{
        classes: {
            toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
            description: 'group-[.toast]:text-muted-foreground',
            actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
        },
        duration: TOAST_DURATION_MS
    }}
    {...restProps}
/>
