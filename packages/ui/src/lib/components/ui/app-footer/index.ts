import Content from './app-footer-content.svelte';
import Root from './app-footer.svelte';

export const FOOTER_VARIANTS = {
	normal: 'h-24',
	slim: 'h-16'
};

export type FooterVariant = keyof typeof FOOTER_VARIANTS;

export {
	Content,
	//
	Root as Footer,
	Content as FooterContent,
	Root
};
