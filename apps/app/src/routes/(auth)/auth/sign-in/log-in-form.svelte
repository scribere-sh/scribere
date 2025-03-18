<script lang="ts">
    import type { PageData } from './$types';

    import { toast } from 'svelte-sonner';
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';

    import * as Form from '@scribere/ui/form';
    import { Input } from '@scribere/ui/input';

    import { logInFormSchema } from '$client/forms';
    import type { PropsObj } from '$util';

    let {
        form: _form,
        disabled = $bindable(false)
    }: {
        form: PageData['form'];
        disabled: boolean;
    } = $props();

    let emailRef: HTMLElement | null = $state(null);

    $effect(() => {
        if (emailRef) emailRef.focus();
    });

    const form = superForm(_form, {
        validators: zodClient(logInFormSchema),
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

    const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="w-full">
    <Form.Field {form} name="handleOrEmail">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Handle or Email Address</Form.Label>
                <Input
                    {...props}
                    {disabled}
                    placeholder="example@contoso.com / john.doe123"
                    required
                    bind:value={$formData.handleOrEmail}
                    bind:ref={emailRef}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="password">
        <Form.Control>
            {#snippet children({ props }: PropsObj)}
                <Form.Label>Password</Form.Label>
                <Input
                    {...props}
                    {disabled}
                    placeholder="***********"
                    type="password"
                    required
                    bind:value={$formData.password}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Button {disabled} class="mt-4 w-full">Sign In</Form.Button>
</form>
