<script lang="ts">
    import type { PageProps } from './$types';

    import ForgotPasswordForm from './forgot-password-form.svelte';
    import Check from 'lucide-svelte/icons/check';

    import * as Card from '@scribere/ui/card';
    import { Button } from '@scribere/ui/button';

    import { route } from '$routes';

    const { data }: PageProps = $props();
    let success = $state(false);
</script>

<Card.Root class="h-80 w-96">
    {#if success}
        <Card.Header>
            <Card.Title>Success</Card.Title>
            <Card.Description
                >If the submitted email address is in the system, we will send it a reset link!</Card.Description
            >
        </Card.Header>
        <Card.Content class="grid h-56 place-items-center">
            <Check class="size-8 text-green-500" />
        </Card.Content>
    {:else}
        <Card.Header>
            <Card.Title>Forgot Password?</Card.Title>
            <Card.Description
                >Enter your email address below to reset your password.</Card.Description
            >
        </Card.Header>
        <Card.Content>
            <ForgotPasswordForm form={data.form} bind:success />
        </Card.Content>
    {/if}
</Card.Root>

<div class="mt-6 flex flex-col gap-3">
    <Button variant="link" href={route('/auth/sign-in')}>Sign In</Button>
</div>
