<script lang="ts">
    import type { PageProps } from './$types';

    import { toggleMode } from 'mode-watcher';
    import { writable } from 'svelte/store';

    import * as Tooltip from '@scribere/ui/tooltip';
    import { type ButtonVariant, buttonVariants } from '@scribere/ui/button';
    import { Input } from '@scribere/ui/input';
    import { Label } from '@scribere/ui/label';
    import { cn, debounce } from '@scribere/ui/utils';

    /**
     * Unique ID for this instance of this component that
     * is consistent on in CSR and SSR.
     *
     * Good for ensuring that an `id` & `for` field is unqiue across
     * the application.
     */
    const uid = $props.id();

    const toggleDark = () => {
        toggleMode();
    };

    const { data }: PageProps = $props();

    const { name, nameQuery } = data;

    let nameStore = writable({ name });
    let nameQueryCl = nameQuery(nameStore);

    const nameQueryChanged = debounce<KeyboardEvent | SubmitEvent>((ev) => {
        if (ev.target instanceof HTMLInputElement) {
            const value = ev.target.value.trim();
            if ($nameStore.name !== value) {
                nameStore.set({ name: value });
                $nameQueryCl.refetch();
            }
        }
    }, 500);
</script>

<Tooltip.Provider delayDuration={250}>
    <div class="flex h-screen w-screen flex-col items-center justify-center">
        <div class="flex h-72 flex-row items-center justify-center gap-4 py-4">
            {#each ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as variant (variant)}
                <Tooltip.Root>
                    <Tooltip.Trigger
                        class={cn(
                            buttonVariants({ variant: variant as ButtonVariant }),
                            'w-28 capitalize'
                        )}
                        onclick={toggleDark}
                    >
                        {variant}
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p>Toggles Dark Mode</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            {/each}
        </div>

        <div class="flex h-72 w-64 flex-col items-center justify-center gap-8 py-4">
            <div class="flex w-full flex-col gap-4">
                <Tooltip.Root>
                    <Tooltip.Trigger>
                        {#snippet child({ props })}
                            <Label class="font-semibold" for="{uid}-name-input" {...props}>
                                Name
                            </Label>
                        {/snippet}
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p>Enter your name below to be greeted by the server</p>
                    </Tooltip.Content>
                </Tooltip.Root>

                <Input
                    id="{uid}-name-input"
                    type="text"
                    value={name}
                    onkeyup={nameQueryChanged}
                    onsubmit={nameQueryChanged}
                />
            </div>

            <p class="font-mono">
                {#if $nameQueryCl.isLoading}
                    Loading...
                {:else if $nameQueryCl.isError}
                    Error... check console
                {:else}
                    {$nameQueryCl.data?.message}
                {/if}
            </p>
        </div>
    </div>
</Tooltip.Provider>
