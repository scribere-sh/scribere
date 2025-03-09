<script lang="ts">
	import type { PageProps } from './$types';

	import * as Card from '@scribere/ui/card';
	import * as Avatar from '@scribere/ui/avatar';
	import { Skeleton } from '@scribere/ui/skeleton';

	const { data }: PageProps = $props();

	const profileQuery = data.userProfileQuery();
</script>

<Card.Root class="mx-auto mt-32 w-1/2">
	<div class="flex flex-row">
		<div class="aspect-[1/2] h-20 overflow-visible pl-8">
			<Avatar.Root class="size-44 -translate-y-20 border">
				{#if $profileQuery.isLoading}
					<Skeleton class="w-full" />
				{:else if $profileQuery.isSuccess}
					{@const data = $profileQuery.data}

					<Avatar.Image src="https://placehold.co/400x400" />

					<Avatar.Fallback class="text-2xl uppercase">
						{data.givenName[0]}{data.familyName[0]}
					</Avatar.Fallback>
				{/if}
			</Avatar.Root>
		</div>
		<Card.Header>
			<Card.Title>
				{#if $profileQuery.isLoading}
					<Skeleton class="w-full" />
				{:else if $profileQuery.isSuccess}
					{@const data = $profileQuery.data}
					<span class="text-2xl">{data.givenName}&nbsp;{data.familyName}</span>
				{/if}
			</Card.Title>
			<Card.Description>Your Profile</Card.Description>
		</Card.Header>
	</div>
	<Card.Content>HEHEHEA</Card.Content>

	<!-- TODO: add tags so people can be tagged maybe? -->
</Card.Root>
