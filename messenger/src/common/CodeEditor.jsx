import {useEffect, useRef, useState, useEffectEvent} from "react";
import { basicSetup } from "@codemirror/basic-setup";
import { EditorState } from "@codemirror/state";
import {EditorView, keymap, lineNumbers} from "@codemirror/view"
import {standardKeymap, undo, redo} from "@codemirror/commands"
import { foldGutter, indentOnInput, indentUnit, bracketMatching, foldKeymap, syntaxHighlighting, defaultHighlightStyle, syntaxTree } from '@codemirror/language';
import {javascript, esLint} from "@codemirror/lang-javascript";
import {json, jsonParseLinter} from "@codemirror/lang-json";
import {linter, lintGutter} from "@codemirror/lint";
import * as eslint from "eslint-linter-browserify";
import {theme} from "antd";
const linterJson = linter(jsonParseLinter());

const config = {
    // eslint configuration
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: "module",
    },
    env: {
        browser: false,
        node: false,
    },
    rules: {

    },
};
export function JsonEditor({value, onChange}) {
    return <CodeEditor
        value={value}
        onChange={onChange}
        extensions={[
            keymap.of(standardKeymap),
            json(),
            linterJson,
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            lintGutter(),
            lineNumbers(),
        ]}
    />
}
export function JavascriptEditor({value, onChange}) {
    return <CodeEditor
        value={value}
        onChange={onChange}
        extensions={[
            keymap.of(standardKeymap),
            javascript(),
            linter(esLint(new eslint.Linter(), config)),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            lintGutter(),
            lineNumbers(),
        ]}
    />
}
export default function CodeEditor({value= null, onChange, extensions = []}) {
    const [prevValue, setPrevValue] = useState();
    const editor = useRef();
    const editorState = useRef();
    const editorView = useRef();
    const onUpdate = useRef();
    const {token} = theme.useToken();
    onUpdate.current = onChange;
    useEffect(() => {
        const view = new EditorView({
            state: editorState.current,
            parent: editor.current,
        });
        editorView.current = view;
        return () => {
            editorView.current = null;
            view.destroy();
        };
    }, []);

    // 上层变更了value，重新生成CodeMirror state
    if (value !== prevValue) {
        const updateListener = EditorView.updateListener.of(e => {
            if (e.docChanged) {
                const newValue = e.state.doc.toString();
                setPrevValue(newValue)
                onUpdate.current?.(newValue);
            }
        })

        const state = EditorState.create({
            doc: value,
            extensions: [
                ...extensions,
                updateListener]
        });
        editorView.current?.setState(state);
        editorState.current = state;
        setPrevValue(value);
    }

    return (
        <div
            ref={editor}
            style={{
                border: "1px solid",
                borderColor: token.colorBorder,
                borderRadius: token.borderRadius,
            }}
        />
    );
}