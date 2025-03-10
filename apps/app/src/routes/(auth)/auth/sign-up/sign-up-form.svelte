<script lang="ts">
	import type { PageData } from './$types';

	import type { PropsObj } from '$lib/server/util';
	import { signupFormSchema } from '$lib/client/forms';

	import * as Form from '@scribere/ui/form';
	import { Input } from '@scribere/ui/input';

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
					placeholder="John Doe"
					bind:value={$formData.displayName}
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
					placeholder="john.doe202"
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
					placeholder="example@contoso.com"
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
					bind:value={$formData.password}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button {disabled} class="mt-4 w-full">Sign Up</Form.Button>
</form>
