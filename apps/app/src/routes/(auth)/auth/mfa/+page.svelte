<script lang="ts">
    import type { PageProps } from "./$types";

    import * as Card from "@scribere/ui/card";
	import MfaForm from "./mfa-form.svelte";

    const {
        data
    }: PageProps = $props();

    const form = data.form;
</script>


<Card.Root class="w-96">
    <Card.Header>
        <Card.Title>
            Enter MFA Token
        </Card.Title>
        <Card.Description>
            This account is enrolled with a two-factor authentication token, please enter it below
        </Card.Description>
    </Card.Header>
    <Card.Content class="grid place-items-center">
        <MfaForm form={data.form} />
    </Card.Content>
</Card.Root>
