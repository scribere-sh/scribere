<script lang="ts">
    import type { PageProps } from './$types';

    import LogInForm from './log-in-form.svelte';
    import { fly } from 'svelte/transition';

    import * as Card from '@scribere/ui/card';
    import { Button } from '@scribere/ui/button';
    import { Separator } from '@scribere/ui/separator';
    import { cn } from '@scribere/ui/utils';

    import { METHODS } from '$client/oauth-methods';
    import { route } from '$routes';

    const { data }: PageProps = $props();

    let disabled = $state(false);

    /**
     * **Story Time**
     *
     * When this is run without the `setTimeout`, all OAuth2 buttons become links to
     * `#` before the browser can read it.
     *
     * HOWEVER if a `setTimeout` is called with a timeout of `0`, it will be run on
     * the very next iteration of the event loop, after the browser has been able to
     * read the href property.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#event_loop
     */
    const oauthDisableButton = () => {
        setTimeout(() => (disabled = true), 0);
    };
</script>

<div in:fly={{ y: 10, duration: 300 }}>
    <Card.Root class="flex flex-row" id="main-content">
        <div class="w-96">
            <Card.Header>
                <Card.Title>Log in</Card.Title>
            </Card.Header>
            <Card.Content class="flex flex-row gap-6">
                <LogInForm form={data.form} bind:disabled />
            </Card.Content>
        </div>

        <div class="my-6 grid grid-cols-1 grid-rows-5 place-items-center">
            <Separator orientation="vertical" class="row-span-2" />
            <div class="text-sm italic">or</div>
            <Separator orientation="vertical" class="row-span-2" />
        </div>

        <div class="flex w-96 flex-col justify-center gap-4 p-6">
            {#each METHODS as method (method.id)}
                {@const methodDisabled = !data.useableProviders.includes(method.id)}
                <Button
                    class={cn(
                        'w-full text-center',
                        (methodDisabled || disabled) && 'pointer-events-none opacity-50'
                    )}
                    style="background-color: {method.bg_colour}; color: {method.text_colour}"
                    aria-disabled={methodDisabled || disabled}
                    onclick={oauthDisableButton}
                    href={methodDisabled || disabled
                        ? '#'
                        : route('GET /oauth/[provider]', {
                              provider: method.id
                          })}
                >
                    {#if method.icon}
                        <method.icon />
                    {:else}
                        <div class="w-[24px]"></div>
                    {/if}
                    <span class="select-none">Log in with {method.name}</span>
                </Button>
            {/each}
        </div>
    </Card.Root>
</div>

<div class="mt-6 flex flex-col gap-3" in:fly={{ y: 10, duration: 300, delay: 50 }}>
    <Button
        onclick={() => (disabled = true)}
        class={cn(disabled && 'pointer-events-none')}
        variant="link"
        href={route('/auth/forgot-password')}
    >
        Forgot Password?
    </Button>

    <Button
        onclick={() => (disabled = true)}
        class={cn(disabled && 'pointer-events-none')}
        variant="link"
        href={route('/auth/sign-up')}
    >
        Sign Up
    </Button>
</div>
