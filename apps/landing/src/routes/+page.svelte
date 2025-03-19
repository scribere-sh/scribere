<script lang="ts" module>
    const DEFAULT_NAME = 'Ben';
</script>

<script lang="ts">
    import { onMount } from 'svelte';

    import { Input } from '@scribere/ui/input';
    import { Label } from '@scribere/ui/label';

    const uid = $props.id();

    let name = $state('...');

    const setStoredName = (name: string) => {
        if (window && window.localStorage) window.localStorage.setItem('name', name);
    };

    const loadStoredName = () => {
        if (window && window.localStorage)
            name = window.localStorage.getItem('name') ?? DEFAULT_NAME;
    };

    onMount(() => {
        loadStoredName();
    });
</script>

<main class="grid h-64 w-96 grid-rows-2">
    <div class="grid place-items-center overflow-hidden whitespace-nowrap text-3xl">
        Hello {name}
    </div>
    <div class="mx-auto flex w-4/5 flex-col justify-center gap-2">
        <Label for="{uid}-name">Your Name?</Label>
        <Input
            id="{uid}-name"
            type="text"
            bind:value={name}
            onkeyup={(ev) => {
                if (ev.target instanceof HTMLInputElement) {
                    setStoredName(ev.target.value);
                }
            }}
        />
    </div>
</main>
