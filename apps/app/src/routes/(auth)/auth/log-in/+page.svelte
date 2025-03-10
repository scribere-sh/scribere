<script lang="ts">
	import type { PageProps } from './$types';

	import LogInForm from './log-in-form.svelte';

	import * as Card from '@scribere/ui/card';
	import { Separator } from '@scribere/ui/separator';
	import { Button } from '@scribere/ui/button';

	import { route } from '$routes';
	import { cn } from '@scribere/ui/utils';

	const { data }: PageProps = $props();
</script>

<Card.Root class="flex flex-row">
	<div class="w-96">
		<Card.Header>
			<Card.Title>Log in</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-row gap-6">
			<LogInForm form={data.form} />
		</Card.Content>
	</div>

	<div class="my-6 grid grid-cols-1 grid-rows-5 place-items-center">
		<Separator orientation="vertical" class="row-span-2" />
		<div class="text-sm italic">or</div>
		<Separator orientation="vertical" class="row-span-2" />
	</div>

	<div class="flex w-96 flex-col justify-center gap-4 p-6">
		{#each data.methods as method}
			{@const disabled = !data.useableProviders.includes(method.id)}
			<Button
				class={cn('w-full text-center', disabled && 'pointer-events-none opacity-50')}
				style="background-color: {method.bg_colour}; color: {method.text_colour}"
				aria-disabled={disabled}
				href={disabled
					? '#'
					: route('GET /oauth/[provider]', {
							provider: method.id
						})}
			>
				{#if method.icon}
					<method.icon />
				{:else}
					<div class="w-[24px]"></div>
				{/if}
				<span>Log in with {method.name}</span>
			</Button>
		{/each}
	</div>
</Card.Root>

<div class="mt-6 flex flex-col gap-3">
	<Button variant="link" href={route('/auth/reset-password')}>Forgot Password?</Button>

	<Button variant="link" href={route('/auth/sign-up')}>Sign Up</Button>
</div>
