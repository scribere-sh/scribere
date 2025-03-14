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

        current
    }: {
        rpc: ReturnType<typeof trpc>;
        utils: ReturnType<ReturnType<typeof trpc>['createUtils']>;

        current: string;
    } = $props();

    const uid = $props.id();
    let spinnerState: SpinnerState = $state('loading');
    let value = $state(current);

    const mutation = rpc.account.settings.updateDisplayName.createMutation({
        onSuccess: ({ displayName }) => {
            spinnerState = 'complete';
            current = displayName;
            value = current;
            utils.account.profile.invalidate();
        },
        onError: () => {
            spinnerState = 'error';
        }
    });

    const submitUpdates = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            const value = event.target.value.trim();
            if (value === current || value.length === 0) return;

            spinnerState = 'loading';
            $mutation.mutate({ displayName: event.target.value });
        } else {
            console.error('aAAAAAAA');
        }
    };
</script>

<div class="w-full px-6">
    <Label for={uid}>Display Name</Label>

    <div class="mt-2 flex w-full flex-row items-center gap-2">
        <Input id={uid} placeholder={current} bind:value onkeyup={debounce(submitUpdates, 1000)} />

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
