<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import Copy from '@lucide/svelte/icons/copy';
    import X from '@lucide/svelte/icons/x';
    import { derived, writable } from 'svelte/store';

    import * as AlertDialog from '@scribere/ui/alert-dialog';
    import * as InputOTP from '@scribere/ui/input-otp';
    import * as Tooltip from '@scribere/ui/tooltip';
    import { Button, buttonVariants } from '@scribere/ui/button';
    import { Checkbox } from '@scribere/ui/checkbox';
    import { Input } from '@scribere/ui/input';
    import { Label } from '@scribere/ui/label';
    import { LoadingSpinner } from '@scribere/ui/loading-spinner';

    import type { trpc } from '$client/trpc';

    const {
        rpc,
        utils,

        currentlyEnrolled,
        isError,
        disabled = $bindable(false)
    }: {
        rpc: ReturnType<typeof trpc>;
        utils: ReturnType<ReturnType<typeof trpc>['createUtils']>;

        currentlyEnrolled: boolean;
        isError: boolean;
        disabled: boolean;
    } = $props();

    const uid = $props.id();

    let dialogOpen = writable(false);
    let removeDialogOpen = $state(false);
    let recoveryCodeCopied = $state(false);

    let enrolmentSubmitted = $state(false);
    let unenrolmentSubmitted = $state(false);

    let initialCodeValue = $state('');

    let recoveryKeyConfirmationChecked = $state(false);

    const enrolmentQuery = rpc.account.settings.generateTOTPEnrollment.createQuery(
        undefined,
        derived([dialogOpen], ([$dialogOpen]) => ({
            enabled: $dialogOpen,
            refetchOnMount: false
        }))
    );

    const enrolmentMutation = rpc.account.settings.enrolUserInTOTP.createMutation({
        onSuccess: () => {
            utils.account.settings.loadAuthSettings.refetch();
            recoveryCodeCopied = false;
            enrolmentSubmitted = false;
        },
        onError: () => {
            initialCodeValue = '';
            enrolmentSubmitted = false;
        }
    });

    const unenrolmentMutation = rpc.account.settings.unenrolUserFromTOTP.createMutation({
        onSuccess: () => {
            utils.account.settings.loadAuthSettings.refetch();
            removeDialogOpen = false;
            unenrolmentSubmitted = false;
        },
        onError: () => {
            unenrolmentSubmitted = false;
        }
    });
</script>

<div class="flex h-16 w-full items-center justify-between pb-8 pr-12">
    <span class="inline-flex flex-row">
        <span class="mr-4 font-bold">Status</span>
        {#if currentlyEnrolled}
            Enrolled <Check class="ml-4 text-green-500" />
        {:else}
            Not Enrolled <X class="ml-4 text-red-500" />
        {/if}
    </span>

    <Tooltip.Root>
        <Tooltip.Trigger class="pointer-default">
            {#if currentlyEnrolled}
                <Button
                    disabled={isError || disabled}
                    variant="destructive"
                    onclick={() => (removeDialogOpen = true)}
                >
                    Remove
                </Button>
            {:else}
                <Button disabled={isError || disabled} onclick={() => ($dialogOpen = true)}
                    >Enrol</Button
                >
            {/if}
        </Tooltip.Trigger>
        <Tooltip.Content>
            <p class="select-none">
                {currentlyEnrolled ? 'Unenroll' : 'Enroll'} MFA
            </p>
        </Tooltip.Content>
    </Tooltip.Root>
</div>

<!-- Enrol Dialog -->
<AlertDialog.Root bind:open={() => $dialogOpen, (newOpen) => ($dialogOpen = newOpen)}>
    <AlertDialog.Content>
        {#if !$enrolmentMutation.isSuccess}
            <AlertDialog.Header>
                <div class="inline-flex items-center justify-between">
                    <AlertDialog.Title>Enrol MFA</AlertDialog.Title>

                    <Button size="icon" variant="ghost" onclick={() => ($dialogOpen = false)}>
                        <X />
                    </Button>
                </div>
                <AlertDialog.Description
                    >Scan the QRCode and enter the code to enrol</AlertDialog.Description
                >
            </AlertDialog.Header>

            {#if $enrolmentQuery.isSuccess}
                {@const queryData = $enrolmentQuery.data}
                <div class="mx-auto my-2 aspect-square w-[80%]">
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html queryData.QRCode}
                </div>

                <AlertDialog.Description>Enter the Code Below</AlertDialog.Description>

                <InputOTP.Root class="mx-auto" maxlength={6} bind:value={initialCodeValue}>
                    {#snippet children({ cells })}
                        <InputOTP.Group>
                            {#each cells.slice(0, 3) as cell (cell)}
                                <InputOTP.Slot {cell} />
                            {/each}
                        </InputOTP.Group>
                        <InputOTP.Separator />
                        <InputOTP.Group>
                            {#each cells.slice(3, 6) as cell (cell)}
                                <InputOTP.Slot {cell} />
                            {/each}
                        </InputOTP.Group>
                    {/snippet}
                </InputOTP.Root>

                <div class="mt-2 h-3">
                    {#if $enrolmentMutation.error}
                        {$enrolmentMutation.error.message}
                    {/if}
                </div>

                <Button
                    class="w-full"
                    disabled={initialCodeValue.length < 6 || enrolmentSubmitted}
                    onclick={() => {
                        if (initialCodeValue.length !== 6) return;
                        $enrolmentMutation.mutate({
                            key: queryData.TOTPKey,
                            initialCode: initialCodeValue
                        });
                    }}
                >
                    {#if enrolmentSubmitted}
                        <LoadingSpinner />
                    {:else}
                        Submit Code & Enrol
                    {/if}
                </Button>
            {/if}
        {:else}
            {@const mutationData = $enrolmentMutation.data}

            <AlertDialog.Header>
                <div class="inline-flex items-center justify-between">
                    <AlertDialog.Title>Recovery Key</AlertDialog.Title>
                </div>
                <AlertDialog.Description
                    >This is your recovery key incase you lose access to MFA, don't lose it.</AlertDialog.Description
                >
            </AlertDialog.Header>

            <div class="mx-auto flex w-[80%] flex-row gap-4">
                <Input disabled class="w-full" value={mutationData.recoveryCode} />
                <Button
                    size="icon"
                    variant="ghost"
                    onclick={() => {
                        navigator.clipboard.writeText(mutationData.recoveryCode).then(() => {
                            recoveryCodeCopied = true;
                        });
                    }}
                >
                    {#if recoveryCodeCopied}
                        <Check class="text-green-500" />
                    {:else}
                        <Copy />
                    {/if}
                </Button>
            </div>

            <div class="mx-auto my-4 w-[80%]">
                <Checkbox
                    id={`${uid}-confirmation`}
                    bind:checked={recoveryKeyConfirmationChecked}
                    aria-labelledby="terms-label"
                />
                <Label
                    id="terms-label"
                    for={`${uid}-confirmation`}
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    I confirm that I have saved this code.
                </Label>
            </div>

            <Button
                class="w-full"
                disabled={!recoveryKeyConfirmationChecked}
                onclick={() => {
                    $dialogOpen = false;
                }}
            >
                Done
            </Button>
        {/if}
    </AlertDialog.Content>
</AlertDialog.Root>

<!-- Remove Dialog -->
<AlertDialog.Root bind:open={removeDialogOpen}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <div class="inline-flex items-center justify-between">
                <AlertDialog.Title>Remove MFA?</AlertDialog.Title>

                <Button size="icon" variant="ghost" onclick={() => (removeDialogOpen = false)}>
                    <X />
                </Button>
            </div>
            <AlertDialog.Description>
                Are you sure you want to un-enrol in MFA?
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>No, Keep it on</AlertDialog.Cancel>
            <AlertDialog.Action
                class={buttonVariants({ variant: 'destructive' })}
                disabled={unenrolmentSubmitted}
                onclick={() => {
                    $unenrolmentMutation.mutate();
                }}
            >
                {#if unenrolmentSubmitted}
                    <LoadingSpinner />
                {:else}
                    Yes, It's annoying
                {/if}
            </AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
