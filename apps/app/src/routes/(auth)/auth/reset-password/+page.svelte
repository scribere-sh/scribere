<script lang="ts">
    import type { PageProps } from './$types';

    import ResetPasswordForm from './reset-password-form.svelte';

    import * as Card from '@scribere/ui/card';
    import { Button } from '@scribere/ui/button';

    import { route } from '$routes';

    const { data }: PageProps = $props();
</script>

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
        />
    </Card.Content>
</Card.Root>

<div class="mt-6 flex flex-col gap-3">
    <Button variant="link" href={route('/auth/sign-in')}>Sign In</Button>
</div>
