<script lang="ts">
    import type { PageData } from './$types';

    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';

    import * as Form from '@scribere/ui/form';
    import { Input } from '@scribere/ui/input';

    import { resetPasswordAccountSettingsSchema } from '$client/forms';

    const {
        form: _form
    }: {
        form: PageData['updatePasswordForm'];
    } = $props();

    let disabled = $state(false);

    const form = superForm(_form, {
        validators: zodClient(resetPasswordAccountSettingsSchema)
    });

    const { form: formData, enhance, } = form;
</script>

<span class="text-xl">Change Password</span>

<form
    class="mb-8 mr-12 mt-4 grid grid-cols-2 gap-x-8"
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
                    {disabled}
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
                    {disabled}
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
                    {disabled}
                    placeholder="************"
                    type="password"
                    bind:value={$formData.confirmNewPassword}
                />
            {/snippet}
        </Form.Control>

        <div class="mb-2 h-4"> <Form.FieldErrors /></div>
    </Form.Field>

    <Form.Button {disabled} variant="secondary" class="mt-4 w-1/2">Change Password</Form.Button>
</form>
