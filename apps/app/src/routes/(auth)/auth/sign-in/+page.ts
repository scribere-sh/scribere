import type { PageLoad } from './$types';

import type { Component } from 'svelte';

import { GitHub, Google } from '@scribere/ui/logos';

type OAuthProviderItem = {
    /**
     * The Icon to the rendered in the button
     *
     * should be an SVG 24px x 24px (we may change
     * this with a class override).
     */
    icon?: Component;
    /**
     * Name to display in the button, will be placed in the template
     *
     * "Log in with {platform}"
     */
    name: string;
    /**
     * The ID of the provider, the user upon clicking this login button will
     * be redirected to `/oauth/{id}` and will go through the standard oauth
     * process.
     */
    id: string;
    /**
     * Background colour of the button, should be recogniseable as a
     * brand colour for the provider.
     */
    bg_colour: string;
    /**
     * The colour of the text on the button, this should pass at least the
     * ***AA Normal*** test on https://colourcontrast.cc/ when used with
     * the {@link OAuthProviderItem.bg_colour | `bg_colour`}.
     *
     * The Icon will also be rendered in this colour.
     */
    text_colour: string;
};

const METHODS: OAuthProviderItem[] = [
    {
        icon: GitHub,
        name: 'GitHub',
        id: 'github',
        bg_colour: '#181717',
        text_colour: '#FEFEFE'
    },
    // {
    //     icon: Atlassian,
    //     name: 'Atlassian',
    //     id: 'atlassian',
    //     bg_colour: '#0050D4',
    //     text_colour: '#FEFEFE'
    // },
    {
        icon: Google,
        name: 'Google',
        id: 'google',
        bg_colour: '#FEFEFE',
        text_colour: '#000000DD'
    }
];

export const load: PageLoad = async (event) => {
    return {
        methods: METHODS,
        // also load server data
        ...event.data
    };
};
