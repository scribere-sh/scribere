<script lang="ts">
    import AuthContainer from './auth-container.svelte';
    import { onMount } from 'svelte';
    import { toast } from 'svelte-sonner';

    import { Button } from '@scribere/ui/button';
    import { Toaster } from '@scribere/ui/sonner';
    import { ThemeToggle } from '@scribere/ui/theme-toggle';

    import { MESSAGES } from '$client/messages';
    import ScribereBorder from '$lib/assets/scribere-border.png';

    const { data, children } = $props();

    onMount(() => {
        if (data.message) {
            const msg = MESSAGES[data.message];
            let toastKind;

            switch (msg.kind) {
                case 'success':
                    toastKind = toast.success;
                    break;
                case 'error':
                    toastKind = toast.error;
                    break;
                default:
                    toastKind = toast.info;
                    break;
            }

            toastKind(msg.message);
        }
    });
</script>

<Toaster richColors position="bottom-center" />

<div class="h-screen w-screen overflow-hidden bg-background">
    <header class="absolute top-0 h-24 w-full">
        <div
            class="mx-auto flex h-full max-w-full flex-row items-center justify-between px-4 xl:max-w-screen-xl xl:px-0"
        >
            <img class="h-[50%] [image-rendering:crisp-edges]" src={ScribereBorder} alt="Logo" />
        </div>
    </header>

    <AuthContainer>
        {@render children()}
    </AuthContainer>

    <footer class="absolute bottom-0 h-24 w-full">
        <div
            class="mx-auto flex h-full max-w-full flex-row items-center justify-between px-4 xl:max-w-screen-xl xl:px-0"
        >
            <span class="text-sm">&copy;&nbsp;Scribere&nbsp;2025</span>

            <div class="flex flex-row gap-4">
                <!-- TODO -->
                <Button variant="link">Legal</Button>
                <ThemeToggle />
            </div>
        </div>
    </footer>
</div>
