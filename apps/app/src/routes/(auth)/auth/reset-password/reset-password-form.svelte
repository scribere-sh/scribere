<script lang="ts">
    import type { PageData } from './$types';

    import { toast } from 'svelte-sonner';
    import { superForm } from 'sveltekit-superforms';
    import { zodClient } from 'sveltekit-superforms/adapters';

    import * as Form from '@scribere/ui/form';
    import { Input } from '@scribere/ui/input';

    import { resetPasswordFormSchema } from '$forms';
    import type { PropsObj } from '$util';

    let {
        form: _form,
        challengeRef,
        challengeToken,
        disabled = $bindable(false)
    }: {
        form: PageData['form'];
        challengeRef: PageData['challengeRef'];
        challengeToken: PageData['challengeToken'];
        disabled: boolean;
    } = $props();

    const form = superForm(_form, {
        validators: zodClient(resetPasswordFormSchema),
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
    <input type="hidden" name="challengeRef" value={challengeRef} />
    <input type="hidden" name="challengeToken" value={challengeToken} />

    <Form.Field {form} name="newPassword">
        <Form.Control>
            {#snippet children({ props }: PropsObj)}
                <Form.Label>New Password</Form.Label>
                <Input
                    type="password"
                    placeholder="**********"
                    bind:value={$formData.newPassword}
                    {disabled}
                    {...props}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="newPasswordConfirm">
        <Form.Control>
            {#snippet children({ props }: PropsObj)}
                <Form.Label>Confirm New Password</Form.Label>
                <Input
                    type="password"
                    placeholder="**********"
                    bind:value={$formData.newPasswordConfirm}
                    {disabled}
                    {...props}
                />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Button {disabled} class="mt-4 w-full">Reset</Form.Button>
</form>
