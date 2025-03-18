import { schema } from './schema';
import { ellipsis, InputRule, inputRules } from 'prosemirror-inputrules';
import { keymap } from 'prosemirror-keymap';
import { TextSelection } from 'prosemirror-state';

const headingRule = new InputRule(/^#{1,6} $/, (state, _match, start, end) => {
    return state.tr
        .setBlockType(start, end, schema.nodes.heading, { level: end - start })
        .deleteRange(start, end);
});

const boldItalicRule = new InputRule(/([*_]{1,3})[^*_]+([*_]{1,3})/, (state, match, start, end) => {
    // weird assertion
    if (match.length != 3) return null;

    const [, prefix, suffix] = match;
    if (prefix.length === suffix.length) {
        let tr = state.tr;

        if (prefix.length !== 2) {
            // 1 and 3 => em
            tr = tr.addMark(start, end, schema.marks.em.create());
        }

        if (prefix.length > 1) {
            // 2 and 3 => strong
            tr = tr.addMark(start, end, schema.marks.strong.create());
        }

        tr = tr
            .deleteRange(end - (suffix.length - 1), end)
            .deleteRange(start, start + prefix.length);

        console.log({ match, tr });

        return tr;
    }

    return null;
});

const codeBlockRule = new InputRule(/^`{3}([a-zA-Z0-9-]+)? /, (state, match, start, end) => {
    return state.tr
        .insert(end + 1, schema.nodes.paragraph.create())
        .setBlockType(start, end, schema.nodes.codeBlock, {
            lang: (match[1] ?? 'plaintext').toLowerCase()
        })
        .deleteRange(start, end)
        .insert(start - 1, schema.nodes.paragraph.create());
});

export const exitCodeBlockKeymap = () => {
    let enterPressed = false;
    return keymap({
        'Shift-Enter': (state, dispatch) => {
            const { selection, schema } = state;
            const { $from } = selection;

            const node = $from.node($from.depth);

            if (node.type === schema.nodes.codeBlock) {
                enterPressed = false;
                if (dispatch) dispatch(state.tr.insertText('\n'));
                return true;
            }

            return false;
        },
        Enter: (state, dispatch) => {
            const { selection, schema } = state;
            const { $from, to } = selection;

            const node = $from.node($from.depth);

            if (
                node.type === schema.nodes.codeBlock &&
                node.textContent[$from.parentOffset - 1] === '\n'
            ) {
                if (enterPressed) {
                    if (dispatch) {
                        const paragraphNode = schema.nodes.paragraph.create();
                        const tr = state.tr;
                        dispatch(
                            tr
                                .insert(to + 1, paragraphNode)
                                .setSelection(TextSelection.create(tr.doc, to + 2))
                        );
                    }

                    enterPressed = false;
                    return true;
                } else {
                    enterPressed = true;
                    return false;
                }
            }

            return false;
        }
    });
};

export const inputRulesPlugin = inputRules({
    rules: [ellipsis, headingRule, boldItalicRule, codeBlockRule]
});
