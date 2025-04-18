<script lang="ts">
    import type { PageData } from './$types';

    import { toast } from 'svelte-sonner';
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';

    import * as Form from '@scribere/ui/form';
    import { Input } from '@scribere/ui/input';
    import { LoadingSpinner } from '@scribere/ui/loading-spinner';

    import { signupFormSchema } from '$client/forms';
    import type { PropsObj } from '$util';

    let {
        form: _form,
        disabled = $bindable(false)
    }: {
        form: PageData['form'];
        disabled: boolean;
    } = $props();

    let displayNameRef: HTMLElement | null = $state(null);

    $effect(() => {
        if (displayNameRef) displayNameRef.focus();
    });

    const form = superForm(_form, {
        validators: zodClient(signupFormSchema),
        onResult: ({ result }) => {
            // if redirecting, do not re-enable
            // they'll be leaving the page soon anyway
            if (!['redirect'].includes(result.type)) disabled = false;
            if (result.type === 'error') {
                toast.error(`Failed to create account: ${result.error.message}`);
            }
        },
        onSubmit: () => {
            disabled = true;
        }
    });

    const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="w-full">
    <Form.Field {form} name="displayName">
        <Form.Control>
            {#snippet children({ props }: PropsObj)}
                <Form.Label>Display Name</Form.Label>
                <Input
                    {...props}
                    {disabled}
                    autocomplete="nickname"
                    placeholder="John Doe"
                    required
                    bind:value={$formData.displayName}
                    bind:ref={displayNameRef}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="handle">
        <Form.Control>
            {#snippet children({ props }: PropsObj)}
                <Form.Label>Handle</Form.Label>
                <Input
                    {...props}
                    {disabled}
                    autocomplete="username"
                    placeholder="john.doe202"
                    required
                    bind:value={$formData.handle}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="emailAddress">
        <Form.Control>
            {#snippet children({ props }: PropsObj)}
                <Form.Label>Email Address</Form.Label>
                <Input
                    {...props}
                    {disabled}
                    autocomplete="email"
                    placeholder="example@contoso.com"
                    required
                    bind:value={$formData.emailAddress}
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
                    placeholder="********"
                    type="password"
                    autocomplete="new-password"
                    required
                    bind:value={$formData.password}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="passwordConfirm">
        <Form.Control>
            {#snippet children({ props }: PropsObj)}
                <Form.Label>Confirm Password</Form.Label>
                <Input
                    {...props}
                    {disabled}
                    autocomplete="new-password"
                    placeholder="********"
                    type="password"
                    required
                    bind:value={$formData.passwordConfirm}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Button {disabled} class="mt-4 w-full">
        {#if disabled}
            <LoadingSpinner />
        {:else}
            Sign Up
        {/if}
    </Form.Button>
</form>
