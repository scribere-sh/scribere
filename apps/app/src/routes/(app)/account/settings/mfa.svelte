<script lang="ts">
    import Check from '@lucide/svelte/icons/check';
    import X from '@lucide/svelte/icons/x';
    import Copy from '@lucide/svelte/icons/copy'
    

    import { derived, writable } from 'svelte/store';

    import * as AlertDialog from '@scribere/ui/alert-dialog';
    import { Button, buttonVariants } from '@scribere/ui/button';
    import {Checkbox} from '@scribere/ui/checkbox';
    import {Label} from '@scribere/ui/label';
    
    import * as InputOTP from '@scribere/ui/input-otp';

    import type { trpc } from '$client/trpc';
    import { Input } from '@scribere/ui/input';

    const {
        rpc,
        utils,

        currentlyEnrolled,
        isError
    }: {
        rpc: ReturnType<typeof trpc>;
        utils: ReturnType<ReturnType<typeof trpc>['createUtils']>;

        currentlyEnrolled: boolean;
        isError: boolean;
    } = $props();

    const uid = $props.id();

    let dialogOpen = writable(false);
    let removeDialogOpen = $state(false);
    let recoveryCodeCopied = $state(false);

    let initialCodeValue = $state('');

    let recoveryKeyConfirmationChecked = $state(false);

    const enrolmentQuery = rpc.account.settings.generateTOTPEnrollment.createQuery(
        undefined,
        derived([dialogOpen], ([$dialogOpen]) => ({
            enabled: $dialogOpen,
            refetchOnMount: false,
        }))
    );

    const enrolmentMutation = rpc.account.settings.enrolUserInTOTP.createMutation({
        onSuccess: () => {
            utils.account.settings.loadAuthSettings.refetch();
            recoveryCodeCopied = false;
        },
        onError: () => {
            initialCodeValue = "";
        }
    });

    const unenrolmentMutation = rpc.account.settings.unenrolUserFromTOTP.createMutation({
        onSuccess: () => {
            utils.account.settings.loadAuthSettings.refetch();
            removeDialogOpen = false;
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

    {#if currentlyEnrolled}
        <Button disabled={isError} variant="destructive" onclick={() => (removeDialogOpen = true)}
            >Remove</Button
        >
    {:else}
        <Button disabled={isError} onclick={() => ($dialogOpen = true)}>Enrol</Button>
    {/if}
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
                <AlertDialog.Description>Scan the QRCode and enter the code to enrol</AlertDialog.Description>
            </AlertDialog.Header>
            
            {#if $enrolmentQuery.isSuccess}
            {@const queryData = $enrolmentQuery.data}
                <div class="w-[80%] aspect-square mx-auto my-2">
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html queryData.QRCode}
                </div>

                <AlertDialog.Description>
                    Enter the Code Below
                </AlertDialog.Description>

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

                <Button class="w-full" disabled={initialCodeValue.length < 6} onclick={() => {
                    if (initialCodeValue.length !== 6) return;
                    $enrolmentMutation.mutate({
                        key: queryData.TOTPKey,
                        initialCode: initialCodeValue
                    });
                }}>Submit Code & Enrol</Button>
            {/if}
        {:else}
            {@const mutationData = $enrolmentMutation.data}

            <AlertDialog.Header>
                <div class="inline-flex items-center justify-between">
                    <AlertDialog.Title>Recovery Key</AlertDialog.Title>
                </div>
                <AlertDialog.Description>This is your recovery key incase you lose access to MFA, don't lose it.</AlertDialog.Description>
            </AlertDialog.Header>

            <div class="w-[80%] flex flex-row mx-auto gap-4">
                <Input disabled class="w-full" value={mutationData.recoveryCode} />
                <Button size="icon" variant="ghost" onclick={() => {
                    navigator.clipboard.writeText(mutationData.recoveryCode).then(() => {
                        recoveryCodeCopied = true;
                    })
                }}>
                    {#if recoveryCodeCopied}
                        <Check class="text-green-500" />
                    {:else}
                        <Copy />
                    {/if}
                </Button>
            </div>

            <div class="w-[80%] mx-auto my-4">
                <Checkbox id={`${uid}-confirmation`} bind:checked={recoveryKeyConfirmationChecked} aria-labelledby="terms-label" />
                <Label
                    id="terms-label"
                    for={`${uid}-confirmation`}
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    I confirm that I have saved this code.
                </Label>
            </div>

            <Button class="w-full" disabled={!recoveryKeyConfirmationChecked} onclick={() => {
                $dialogOpen = false;
            }}>
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
            <AlertDialog.Cancel>
                No, Keep it on
            </AlertDialog.Cancel>
            <AlertDialog.Action class={buttonVariants({ variant: "destructive" })} onclick={() => {
                $unenrolmentMutation.mutate()
            }}>
                Yes, It's annoying
            </AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
