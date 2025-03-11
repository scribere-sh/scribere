<script lang="ts">
    import type { PageProps } from './$types';

    import SignUpForm from './sign-up-form.svelte';

    import * as Card from '@scribere/ui/card';
    import { Button } from '@scribere/ui/button';

    import { route } from '$routes';

    const { data }: PageProps = $props();
</script>

<Card.Root class="flex w-96 flex-row" id="main-content">
    <div class="w-full">
        <Card.Header>
            <Card.Title>Sign Up</Card.Title>
        </Card.Header>
        <Card.Content class="flex flex-row gap-6">
            <SignUpForm form={data.form} />
        </Card.Content>
    </div>
</Card.Root>

<div class="mt-6 flex flex-col gap-3">
    <Button variant="link" href={route('/auth/log-in')}>Log In</Button>
</div>
