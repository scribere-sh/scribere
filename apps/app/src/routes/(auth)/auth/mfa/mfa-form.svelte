<script lang="ts">
    import type { PageData } from "./$types";

	import * as Form from '@scribere/ui/form';
    import * as InputOTP from '@scribere/ui/input-otp';
	import type { PropsObj } from "$lib/server/util";

	import { superForm } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters"

	import { mfaFormSchema } from "$lib/client/forms";

    const {
        form: _form
    }: Pick<PageData, "form"> = $props();

    const form = superForm(_form, {
        validators: zodClient(mfaFormSchema)
    })

    const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
    <Form.Field {form} name="mfa">
        <Form.Control>
            {#snippet children({props}: PropsObj)}
                <InputOTP.Root maxlength={6} {...props} bind:value={$formData.mfa}>
                    {#snippet children({ cells })}
                        <InputOTP.Group>
                            {#each cells.slice(0, 3) as cell}
                                <InputOTP.Slot {cell} />
                            {/each}
                        </InputOTP.Group>
                        <InputOTP.Separator />
                        <InputOTP.Group>
                            {#each cells.slice(3, 6) as cell}
                                <InputOTP.Slot {cell} />
                            {/each}
                        </InputOTP.Group>
                    {/snippet}
                </InputOTP.Root>
            {/snippet}
        </Form.Control>
		<Form.FieldErrors />
    </Form.Field>
    <Form.Button class="mt-4 w-full">
        Submit
    </Form.Button>
</form>
