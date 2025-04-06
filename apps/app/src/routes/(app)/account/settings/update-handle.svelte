<script lang="ts">
    import { fly } from 'svelte/transition';

    import { Input } from '@scribere/ui/input';
    import { Label } from '@scribere/ui/label';
    import { LoadingSpinner, type SpinnerState } from '@scribere/ui/loading-spinner';
    import { debounce } from '@scribere/ui/utils';

    import type { trpc } from '$client/trpc';

    let {
        rpc,
        utils,

        current,
        isError,
        disabled = $bindable(false)
    }: {
        rpc: ReturnType<typeof trpc>;
        utils: ReturnType<ReturnType<typeof trpc>['createUtils']>;

        current: string;
        isError: boolean;
        disabled: boolean;
    } = $props();

    const uid = $props.id();
    let spinnerState: SpinnerState = $state('loading');
    let value = $state(current);

    let inputDisabled = $state(false);

    const mutation = rpc.account.settings.updateHandle.createMutation({
        onSuccess: ({ handle }) => {
            spinnerState = 'complete';
            current = handle;
            value = current;
            inputDisabled = false;
            utils.account.profile.invalidate();
        },
        onError: () => {
            spinnerState = 'error';
            inputDisabled = false;
        }
    });

    const submitUpdates = (event: Event) => {
        if (isError) return;

        if (event.target instanceof HTMLInputElement) {
            const value = event.target.value.trim();
            if (value === current || value.length === 0) return;

            inputDisabled = true;
            spinnerState = 'loading';
            $mutation.mutate({ handle: event.target.value });
        } else {
            console.error('aAAAAAAA');
        }
    };
</script>

<div class="w-full p-6">
    <Label for={uid}>Handle</Label>

    <div class="mt-2 flex w-full flex-row items-center gap-2">
        <span class="select-none">&#64</span>
        <Input
            id={uid}
            autocomplete="username"
            placeholder={current}
            disabled={inputDisabled || isError || disabled}
            bind:value
            onkeyup={debounce(submitUpdates, 1000)}
        />

        <div class="grid w-12 place-content-end">
            {#if !$mutation.isIdle}
                <LoadingSpinner state={spinnerState} />
            {/if}
        </div>
    </div>

    <div class="mt-2 h-3">
        {#if $mutation.error}
            <div in:fly={{ y: -10 }} class="mb-2 mt-2 text-xs font-medium text-destructive-text">
                {$mutation.error.message}
            </div>
        {/if}
    </div>
</div>
