<script lang="ts">
    import type { PageData } from './$types';

    import { toast } from 'svelte-sonner';
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';

    import * as Form from '@scribere/ui/form';
    import * as InputOTP from '@scribere/ui/input-otp';

    import { mfaFormSchema } from '$forms';
    import type { PropsObj } from '$util';

    const { form: _form }: Pick<PageData, 'form'> = $props();

    let disabled = $state(false);

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
        },
    });

    const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
    <Form.Field {form} name="mfa">
        <Form.Control>
            {#snippet children({ props }: PropsObj)}
                <InputOTP.Root {disabled} maxlength={6} {...props} bind:value={$formData.mfa}>
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
    <Form.Button class="mt-4 w-full">Submit</Form.Button>
</form>
