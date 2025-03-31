<script lang="ts">
    import AuthContainer from './auth-container.svelte';
    import { onMount } from 'svelte';

    import { Button } from '@scribere/ui/button';
    import { Toaster } from '@scribere/ui/sonner';
    import { ThemeToggle } from '@scribere/ui/theme-toggle';
    import { cn } from '@scribere/ui/utils';

    import { openAuthMessage } from '$client/messages';
    import Logo from '$lib/assets/logo.svg';
    
    import WavyThing1 from '$lib/assets/wavy-thing-1.svg';
    import WavyThing2 from '$lib/assets/wavy-thing-2.svg';
    import WavyThing3 from '$lib/assets/wavy-thing-3.svg';

    const { data, children } = $props();

    const wavyThing = [
        {
            component: WavyThing1,
            classes: 'bg-fixed bg-no-repeat [background-position:right] [background-size:75vh]'
        },
        {
            component: WavyThing2,
            classes: 'bg-fixed bg-no-repeat [background-position:center] [background-size:150vw]'
        },
        {
            component: WavyThing3,
            classes: 'bg-fixed bg-no-repeat [background-position:right] [background-size:90vw]'
        }
    ][data.wavyThingIndex];

    onMount(() => {
        openAuthMessage(data.message);
    });
</script>

<Toaster richColors position="top-center" />

<div
    class={cn('absolute h-screen w-screen overflow-hidden', wavyThing.classes)}
    style:background-image={`url(${wavyThing.component})`}
>
    <header class="absolute top-0 h-header w-screen">
        <div
            class="mx-auto flex h-full max-w-full flex-row items-center justify-between px-4 xl:max-w-screen-xl xl:px-0"
        >
            <img class="h-[50%]" src={Logo} alt="Logo" />
        </div>
    </header>

    <AuthContainer>
        {@render children()}
    </AuthContainer>

    <footer
        class="absolute bottom-0 h-footer w-screen bg-background/70 backdrop-blur transition-[height] supports-[backdrop-blur]:bg-background/50"
    >
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
