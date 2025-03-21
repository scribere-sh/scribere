<script lang="ts">
    import type { PageProps } from './$types';

    import { cardBackround } from '../classes';
    import MfaForm from './mfa-form.svelte';
    import { blur } from 'svelte/transition';

    import * as Card from '@scribere/ui/card';
    import { cn } from '@scribere/ui/utils';

    const { data }: PageProps = $props();
    const { form } = data;
</script>

<div in:blur={{ duration: 200 }}>
    <Card.Root class={cn('w-96', cardBackround)} id="main-content">
        <Card.Header>
            <Card.Title>Enter MFA Token</Card.Title>
            <Card.Description>
                This account is enrolled with a two-factor authentication token, please enter it
                below
            </Card.Description>
        </Card.Header>
        <Card.Content class="grid place-items-center">
            <MfaForm {form} />
        </Card.Content>
    </Card.Root>
</div>
