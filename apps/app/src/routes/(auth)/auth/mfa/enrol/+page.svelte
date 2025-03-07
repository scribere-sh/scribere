<script lang="ts">
    import type { PageProps } from "./$types";

    import * as Card from "@scribere/ui/card";
	import MfaEnrolForm from "./mfa-enrol-form.svelte";
	import { Button } from "@scribere/ui/button";
	import { Separator } from "@scribere/ui/separator";

    const {
        data
    }: PageProps = $props();

    let buttonDisabled = $state(false);

    const copyData = async () => {
        buttonDisabled = true;
        await navigator.clipboard.writeText(enrolmentUrl);
        buttonDisabled = false;
    };

    const {
        challenge,
        form,
        encrollmentSVG,
        enrolmentUrl
    } = data;
</script>

<Card.Root class="w-96">
    <Card.Header>
        <Card.Title>Enrol in 2FA</Card.Title>
        <Card.Description>Scan the QRCode or click the button to copy enrolment code to enrol in 2FA</Card.Description>
    </Card.Header>
    <Card.Content class="flex flex-col items-center gap-2">
        <div class="aspect-square w-full mx-auto mt-4 bg-white p-4 rounded-sm">
            {@html encrollmentSVG}
        </div>

        <Button disabled={buttonDisabled} onclick={copyData}>
            Copy Code
        </Button>

        <Separator class="my-4" />

        <div class="mb-4">Enter Code to Complete Enrolment</div>

        <MfaEnrolForm {challenge} {form} />
    </Card.Content>
</Card.Root>
