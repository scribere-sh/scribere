<script lang="ts">
    import type { PageData } from './$types';

    import { toast } from 'svelte-sonner';
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';

    import * as Accordion from '@scribere/ui/accordion';
    import * as Form from '@scribere/ui/form';
    import * as InputOTP from '@scribere/ui/input-otp';
    import { Input } from '@scribere/ui/input';

    import { mfaFormSchema } from '$client/forms';
    import type { PropsObj } from '$util';
    import { LoadingSpinner } from '@scribere/ui/loading-spinner';

    const { form: _form }: Pick<PageData, 'form'> = $props();

    let disabled = $state(false);

    let mfaRef: HTMLElement | null = $state(null);

    $effect(() => {
        if (!mfaRef) return;
        const inputElement = mfaRef.querySelector<HTMLInputElement>('input[name="mfa"]');
        if (inputElement) inputElement.focus();
    });

    const form = superForm(_form, {
        validators: zodClient(mfaFormSchema),
        onResult: ({ result }) => {
            if (!['redirect'].includes(result.type)) disabled = false;
            if (result.type === 'error') {
                toast.error(`Failed to login: ${result.error.message}`);
            }
        },
        onSubmit: () => {
            disabled = true;
        }
    });

    const { form: formData, enhance, submit } = form;
</script>

<form method="POST" use:enhance>
    <Form.Field {form} name="mfa">
        <Form.Control>
            {#snippet children({ props }: PropsObj)}
                <InputOTP.Root
                    {disabled}
                    autocomplete="one-time-code"
                    onComplete={() => submit()}
                    maxlength={6}
                    {...props}
                    bind:value={$formData.mfa}
                    bind:ref={mfaRef}
                >
                    {#snippet children({ cells })}
                        <InputOTP.Group>
                            <!-- eslint-disable-next-line svelte/require-each-key -->
                            {#each cells.slice(0, 3) as cell}
                                <InputOTP.Slot {cell} />
                            {/each}
                        </InputOTP.Group>
                        <InputOTP.Separator />
                        <InputOTP.Group>
                            <!-- eslint-disable-next-line svelte/require-each-key -->
                            {#each cells.slice(3, 6) as cell}
                                <InputOTP.Slot {cell} />
                            {/each}
                        </InputOTP.Group>
                    {/snippet}
                </InputOTP.Root>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Accordion.Root type="single" class="w-full overflow-x-visible">
        <Accordion.Item class="border-b-0">
            <Accordion.Trigger>Lost access to MFA?</Accordion.Trigger>
            <Accordion.Content class="px-1">
                <Form.Field {form} name="recoveryCode">
                    <Form.Control>
                        {#snippet children({ props }: PropsObj)}
                            <Form.Label>Recovery Code</Form.Label>
                            <Input
                                type="password"
                                autocomplete="current-password"
                                placeholder="**************************"
                                bind:value={$formData.recoveryCode}
                                {disabled}
                                {...props}
                            />
                        {/snippet}
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>

    <Form.Button class="mt-4 w-full" {disabled}>
        {#if disabled}
            <LoadingSpinner />
        {:else}
            Submit
        {/if}
    </Form.Button>
</form>
