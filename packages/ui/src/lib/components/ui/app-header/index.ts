import Content from './app-header-content.svelte';
import Root from './app-header.svelte';

export const HEADER_VARIANTS = {
    normal: 'h-24',
    slim: 'h-16',
};

/**
 * The height of the header to use
 *
 * @default "normal"
 */
export type HeaderVariant = keyof typeof HEADER_VARIANTS;

export {
    //
    Root as AppHeader,
    Content as AppHeaderContent,
    Content,
    Root,
};
