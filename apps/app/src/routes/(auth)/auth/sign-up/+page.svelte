<script lang="ts">
    import type { PageProps } from './$types';

    import SignUpForm from './sign-up-form.svelte';
    import { fly } from 'svelte/transition';

    import * as Card from '@scribere/ui/card';
    import { Button } from '@scribere/ui/button';
    import { cn } from '@scribere/ui/utils';

    import { route } from '$routes';

    const { data }: PageProps = $props();

    let disabled = $state(false);
</script>

<div in:fly={{ y: 10, duration: 300 }}>
    <Card.Root class="flex w-96 flex-row" id="main-content">
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

<div class="mt-6 flex flex-col gap-3" in:fly={{ y: 10, duration: 300, delay: 50 }}>
    <Button
        onclick={() => (disabled = true)}
        class={cn(disabled && 'pointer-events-none')}
        variant="link"
        href={route('/auth/sign-in')}
    >
        Log In
    </Button>
</div>
