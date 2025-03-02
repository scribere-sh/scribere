import { type MarkSpec, type NodeSpec, type SchemaSpec, Schema } from 'prosemirror-model';

const schemaSpec: SchemaSpec = {
	nodes: {
		/**
		 * Doc
		 */
		doc: {
			content: 'block+'
		} as NodeSpec,

		/**
		 * Block Nodes
		 */

		paragraph: {
			content: 'inline*',
			group: 'block',
			parseDOM: [{ tag: 'p' }],
			toDOM: () => ['p', 0]
		} as NodeSpec,

		blockquote: {
			content: 'block+',
			group: 'block',
			defining: true,
			parseDOM: [{ tag: 'blockquote' }],
			toDom: () => ['blockquote', 0]
		} as NodeSpec,

		horizontal_rule: {
			group: 'block',
			parseDOM: [{ tag: 'hr' }],
			toDom: () => ['hr']
		} as NodeSpec,

		heading: {
			attrs: { level: { default: 1, validate: 'number' } },
			content: 'inline*',
			group: 'block',
			defining: true,
			parseDOM: [
				{ tag: 'h1', attrs: { level: 1 } },
				{ tag: 'h2', attrs: { level: 2 } },
				{ tag: 'h3', attrs: { level: 3 } },
				{ tag: 'h4', attrs: { level: 4 } },
				{ tag: 'h5', attrs: { level: 5 } },
				{ tag: 'h6', attrs: { level: 6 } }
			],
			toDOM: (node) => ['h' + node.attrs.level, 0]
		} as NodeSpec,

		code_block: {
			content: 'text*',
			marks: '',
			group: 'block',
			code: true,
			defining: true,
			parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
			toDOM: () => ['pre', ['code', 0]]
		} as NodeSpec,

		/**
		 * Inline Nodes
		 */

		text: {
			group: 'inline'
		} as NodeSpec,

		image: {
			inline: true,
			attrs: {
				src: { validate: 'string' },
				alt: { default: null, validate: 'string|null' },
				title: { default: null, validate: 'string|null' }
			},
			group: 'inline',
			draggable: true,
			parseDOM: [
				{
					tag: 'img[src]',
					getAttrs: (dom: HTMLElement) => {
						return {
							src: dom.getAttribute('src'),
							title: dom.getAttribute('title'),
							alt: dom.getAttribute('alt')
						};
					}
				}
			],
			toDOM: (node) => {
				const { src, alt, title } = node.attrs;
				return ['img', { src, alt, title }];
			}
		} as NodeSpec,

		hard_break: {
			inline: true,
			group: 'inline',
			selectable: false,
			parseDOM: [{ tag: 'br' }],
			toDOM: () => ['br']
		} as NodeSpec
	},
	marks: {
		link: {
			attrs: {
				href: { validate: 'string' },
				title: { default: null, validate: 'string|null' }
			},
			inclusive: false,
			parseDOM: [
				{
					tag: 'a[href]',
					getAttrs: (node: HTMLElement) => {
						return {
							href: node.getAttribute('href'),
							title: node.getAttribute('href')
						};
					}
				}
			],
			toDOM: (node) => {
				const { href, title } = node.attrs;
				return ['a', { href, title }, 0];
			}
		} as MarkSpec,

		em: {
			parseDOM: [
				{ tag: 'i' },
				{ tag: 'em' },
				{ style: 'font-style=italic' },
				{ style: 'font-style=normal', clearMark: (m) => m.type.name == 'em' }
			],
			toDOM: () => ['em', 0]
		} as MarkSpec,

		strong: {
			parseDOM: [
				{ tag: 'strong' },
				// This works around a Google Docs misbehavior where
				// pasted content will be inexplicably wrapped in `<b>`
				// tags with a font-weight normal.
				{
					tag: 'b',
					getAttrs: (node: HTMLElement) => node.style.fontWeight != 'normal' && null
				},
				{ style: 'font-weight=400', clearMark: (m) => m.type.name == 'strong' },
				{
					style: 'font-weight',
					getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
				}
			],
			toDOM: () => ['strong', 0]
		} as MarkSpec,

		code: {
			parseDOM: [{ tag: 'code' }],
			toDOM: () => ['code', 0]
		} as MarkSpec
	}
};

export const schema = new Schema(schemaSpec);
