<script lang="ts">
    import type { PageProps } from './$types';

    import MfaForm from './mfa-form.svelte';
    import { fly } from 'svelte/transition';

    import * as Card from '@scribere/ui/card';

    const { data }: PageProps = $props();
    const { form } = data;
</script>

<div in:fly={{ y: 10, duration: 300 }}>
    <Card.Root class="w-96" id="main-content">
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
