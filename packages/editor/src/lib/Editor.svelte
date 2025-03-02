<script lang="ts">
	import { EditorState, NodeSelection } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { undo, redo, history } from 'prosemirror-history';
	import { keymap } from 'prosemirror-keymap';
	import { baseKeymap, toggleMark } from 'prosemirror-commands';

	import { schema } from './schema';

	import { cn } from '@scribere/ui/utils';
	import { buttonVariants } from '@scribere/ui/button';

	import { onMount } from 'svelte';
	import type { MarkType } from 'prosemirror-model';

	let ref: HTMLElement;

	let editorState: EditorState;
	let view: EditorView;

	const toggleBold = toggleMark(schema.marks.strong);
	const toggleItalic = toggleMark(schema.marks.em);

	const markActive = (state: EditorState, type: MarkType) => {
		let { from, $from: _from, to, empty } = state.selection;
		if (empty) return !!type.isInSet(state.storedMarks || _from.marks());
		else return state.doc.rangeHasMark(from, to, type);
	};

	let isBoldOnSelection = $state(false);

	const makeBold = () => {
		const { state, dispatch } = view;
		if (toggleBold(state, dispatch)) {
			view.focus();
		}
	};

	interface Props {
		class?: string;
		onupdate?: (new_state: EditorState) => void;
	}

	let { class: className, onupdate }: Props = $props();

	onMount(() => {
		editorState = EditorState.create({
			schema,
			plugins: [
				history(),
				keymap({
					'Mod-z': undo,
					'Mod-y': redo,
					'Mod-b': toggleBold,
					'Mod-i': toggleItalic
				}),
				keymap(baseKeymap)
			]
		});

		view = new EditorView(ref, {
			state: editorState,
			dispatchTransaction: (tr) => {
				const new_state = view.state.apply(tr);
				view.updateState(new_state);

				isBoldOnSelection = markActive(new_state, schema.marks.strong);

				if (onupdate) onupdate(new_state);
			}
		});

		return () => {
			view.destroy();
		};
	});
</script>

<div class={cn('h-full', className)}>
	<div class="flex h-16">
		<button
			class={buttonVariants({ variant: isBoldOnSelection ? 'destructive' : 'outline' })}
			onclick={makeBold}>bold</button
		>
	</div>

	<div class="h-full" bind:this={ref}></div>
</div>

<style>
	:global(div.ProseMirror) {
		width: 100%;
		height: 100%;
	}
</style>
