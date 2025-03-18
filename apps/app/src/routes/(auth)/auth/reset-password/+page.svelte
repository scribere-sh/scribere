<script lang="ts">
    import type { PageProps } from './$types';

    import ResetPasswordForm from './reset-password-form.svelte';
    import { fly } from 'svelte/transition';

    import * as Card from '@scribere/ui/card';
    import { Button } from '@scribere/ui/button';
    import { cn } from '@scribere/ui/utils';

    import { route } from '$routes';

    const { data }: PageProps = $props();

    let disabled = $state(false);
</script>

<div in:fly={{ y: 10, duration: 300 }}>
    <Card.Root class="w-96">
        <Card.Header>
            <Card.Title>Reset Password</Card.Title>
            <Card.Description>Enter your new Password Below</Card.Description>
        </Card.Header>

        <Card.Content>
            <ResetPasswordForm
                form={data.form}
                challengeRef={data.challengeRef}
                challengeToken={data.challengeToken}
                bind:disabled
            />
        </Card.Content>
    </Card.Root>
</div>

<div class="mt-6 flex flex-col gap-3" in:fly={{ y: 10, delay: 50 }}>
    <Button
        onclick={() => (disabled = false)}
        class={cn(disabled && 'pointer-events-none')}
        variant="link"
        href={route('/auth/sign-in')}
    >
        Sign In
    </Button>
</div>
