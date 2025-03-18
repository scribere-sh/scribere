<script lang="ts">
    import type { PageData } from './$types';

    import { toast } from 'svelte-sonner';
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';

    import * as Form from '@scribere/ui/form';
    import { Input } from '@scribere/ui/input';

    import { forgotPasswordFormSchema } from '$client/forms';
    import type { PropsObj } from '$util';

    let {
        form: _form,
        success = $bindable(false),
        disabled = $bindable(false)
    }: {
        form: PageData['form'];
        success: boolean;
        disabled: boolean;
    } = $props();

    let emailRef: HTMLElement | null = $state(null);

    $effect(() => {
        if (emailRef) emailRef.focus();
    });

    const form = superForm(_form, {
        validators: zodClient(forgotPasswordFormSchema),
        onResult: ({ result }) => {
            if (result.type === 'success') success = true;
            if (result.type === 'error') {
                toast.error(`Failed to send reset email: ${result.error.message}`);
            }
            if (!['redirect'].includes(result.type)) disabled = false;
        },
        onSubmit: () => {
            disabled = true;
        }
    });

    const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="w-full">
    <Form.Field {form} name="email">
        <Form.Control>
            {#snippet children({ props }: PropsObj)}
                <Form.Label>Email Address</Form.Label>
                <Input {disabled} {...props} bind:value={$formData.email} bind:ref={emailRef} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Button {disabled} class="mt-4 w-full">Reset</Form.Button>
</form>
