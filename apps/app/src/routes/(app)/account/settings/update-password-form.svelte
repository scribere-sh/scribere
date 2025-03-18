<script lang="ts">
    import type { PageData } from './$types';

    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';

    import * as Form from '@scribere/ui/form';
    import { Input } from '@scribere/ui/input';
    import { LoadingSpinner, type SpinnerState } from '@scribere/ui/loading-spinner';

    import { resetPasswordAccountSettingsSchema } from '$client/forms';

    const {
        form: _form,

        isError,
        disabled: markedDisabled
    }: {
        form: PageData['updatePasswordForm'];
        isError: boolean;
        disabled: boolean
    } = $props();

    let disabled = $state(false);
    let status: SpinnerState | null = $state(null);

    const form = superForm(_form, {
        validators: zodClient(resetPasswordAccountSettingsSchema),
        onSubmit: () => {
            status = 'loading';
        },
        onResult: ({ result }) => {
            if (['error', 'failure'].includes(result.type)) status = 'error';
            if (result.type === 'success') status = 'complete';
        }
    });

    const { form: formData, enhance } = form;
</script>

<span class="text-xl">Change Password</span>

<form
    class="grid grid-cols-2 gap-x-8 pb-8 pr-12 pt-4"
    action="?/update-password"
    method="POST"
    use:enhance
>
    <Form.Field {form} name="currentPassword">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Current Password</Form.Label>
                <Input
                    {...props}
                    disabled={disabled || isError || markedDisabled}
                    placeholder="************"
                    type="password"
                    bind:value={$formData.currentPassword}
                />
            {/snippet}
        </Form.Control>

        <div class="mb-2 h-4"> <Form.FieldErrors /></div>
    </Form.Field>

    <span>
        <!-- Don't delete this please it makes the grid work -->
    </span>

    <Form.Field {form} name="newPassword">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>New Password</Form.Label>
                <Input
                    {...props}
                    disabled={disabled || isError || markedDisabled}
                    placeholder="************"
                    type="password"
                    bind:value={$formData.newPassword}
                />
            {/snippet}
        </Form.Control>

        <div class="mb-2 h-4"> <Form.FieldErrors /></div>
    </Form.Field>
    <Form.Field {form} name="confirmNewPassword">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Confirm New Password</Form.Label>
                <Input
                    {...props}
                    disabled={disabled || isError || markedDisabled}
                    placeholder="************"
                    type="password"
                    bind:value={$formData.confirmNewPassword}
                />
            {/snippet}
        </Form.Control>

        <div class="mb-2 h-4"> <Form.FieldErrors /></div>
    </Form.Field>

    <div class="mt-4 grid grid-cols-2 place-items-center">
        <Form.Button disabled={disabled || isError || markedDisabled} variant="secondary">
            Change Password
        </Form.Button>

        {#if status}
            <LoadingSpinner state={status} />
        {/if}
    </div>
</form>
