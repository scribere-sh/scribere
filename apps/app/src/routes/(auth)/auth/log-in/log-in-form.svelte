<script lang="ts">
	import type { PageData } from './$types';
	import type { PropsObj } from '$util';

	import * as Form from '@scribere/ui/form';
	import { Input } from '@scribere/ui/input';

	import { logInFormSchema } from '$forms';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

	const {
		form: _form
	}: {
		form: PageData['form'];
	} = $props();

	let disabled = $state(false);

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
			{#snippet children({ props }: PropsObj)}
				<Form.Label>Hande or Email Address</Form.Label>
				<Input
					{...props}
					{disabled}
					placeholder="example@contoso.com / john.doe123"
					bind:value={$formData.handleOrEmail}
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
					bind:value={$formData.password}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button {disabled} class="mt-4 w-full">Log In</Form.Button>
</form>
