<script lang="ts">
    import { exitCodeBlockKeymap, inputRulesPlugin } from './rules';
    import { schema } from './schema';
    import Bold from 'lucide-svelte/icons/bold';
    import Italic from 'lucide-svelte/icons/italic';
    import { baseKeymap, toggleMark } from 'prosemirror-commands';
    import { history, redo, undo } from 'prosemirror-history';
    import { keymap } from 'prosemirror-keymap';
    import type { MarkType } from 'prosemirror-model';
    import { type Command, EditorState } from 'prosemirror-state';
    import { EditorView } from 'prosemirror-view';
    import { onMount } from 'svelte';

    import { Toggle } from '@scribere/ui/toggle';
    import { cn } from '@scribere/ui/utils';

    let ref: HTMLElement;

    let editorState: EditorState;
    let view: EditorView;

    const toggleBold = toggleMark(schema.marks.strong);
    const toggleItalic = toggleMark(schema.marks.em);

    const isMarkActive = (state: EditorState, type: MarkType) => {
        let { from, $from: _from, to, empty } = state.selection;
        if (empty) return !!type.isInSet(state.storedMarks || _from.marks());
        else return state.doc.rangeHasMark(from, to, type);
    };

    let isBoldOnSelection = $state(false);
    let isItalicOnSelection = $state(false);

    const dispatchCommand: (command: Command) => () => void = (command) => {
        return () => {
            const { state, dispatch } = view;
            if (command(state, dispatch)) {
                view.focus();
            }
        };
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
                exitCodeBlockKeymap(),
                keymap(baseKeymap),
                inputRulesPlugin
            ]
        });

        view = new EditorView(ref, {
            state: editorState,
            dispatchTransaction: (tr) => {
                const new_state = view.state.apply(tr);
                view.updateState(new_state);

                isBoldOnSelection = isMarkActive(new_state, schema.marks.strong);
                isItalicOnSelection = isMarkActive(new_state, schema.marks.em);

                if (onupdate) onupdate(new_state);
            }
        });

        return () => {
            view.destroy();
        };
    });
</script>

<div class={cn('h-full', className)}>
    <div class="flex h-16 flex-row gap-4">
        <Toggle
            variant="outline"
            aria-label="Toggle Bold"
            bind:pressed={isBoldOnSelection}
            onclick={dispatchCommand(toggleBold)}
        >
            <Bold />
            Bold
        </Toggle>

        <Toggle
            variant="outline"
            aria-label="Toggle Italic"
            bind:pressed={isItalicOnSelection}
            onclick={dispatchCommand(toggleItalic)}
        >
            <Italic />
            Italic
        </Toggle>
    </div>

    <div class="h-full" bind:this={ref}></div>
</div>

<style>
    :global(div.ProseMirror) {
        width: 100%;
        height: 100%;
    }

    :global(div.ProseMirror h1) {
        font-size: x-large;
    }

    :global(div.ProseMirror pre.codeBlock) {
        /* margin: 0 1rem; */
        width: calc(100% - 2rem);
        min-height: 1rem;

        border: 1px solid red;
    }
</style>
