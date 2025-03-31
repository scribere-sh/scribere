<script lang="ts">
    import type { PageProps } from './$types';

    import { cardBackround } from '../classes';
    import SignUpForm from './sign-up-form.svelte';
    import { blur } from 'svelte/transition';

    import * as Card from '@scribere/ui/card';
    import { Button } from '@scribere/ui/button';
    import { cn } from '@scribere/ui/utils';

    import { route } from '$routes';

    const { data }: PageProps = $props();

    let disabled = $state(false);
</script>

<div in:blur={{ duration: 200 }}>
    <Card.Root class={cn('flex w-96 flex-row', cardBackround)} id="main-content">
        <div class="w-full">
            <Card.Header>
                <Card.Title>Sign Up</Card.Title>
            </Card.Header>
            <Card.Content class="flex flex-row gap-6">
                <SignUpForm form={data.form} bind:disabled />
            </Card.Content>
        </div>
    </Card.Root>
</div>

<div class="mt-6 flex flex-col gap-3" in:blur={{ duration: 200, delay: 50 }}>
    <Button
        onclick={() => (disabled = true)}
        class={cn(disabled && 'pointer-events-none')}
        variant="link"
        href={route('/auth/sign-in')}
    >
        Sign In
    </Button>
</div>
