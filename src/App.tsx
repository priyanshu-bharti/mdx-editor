import {
    BlockTypeSelect, //
    BoldItalicUnderlineToggles, //
    ChangeCodeMirrorLanguage,
    codeBlockPlugin,
    codeMirrorPlugin,
    ConditionalContents,
    CreateLink, //
    headingsPlugin, //
    imagePlugin,
    InsertCodeBlock,
    InsertImage,
    InsertSandpack,
    InsertThematicBreak, //
    linkDialogPlugin,
    linkPlugin, //
    listsPlugin, //
    ListsToggle, //
    MDXEditor,
    markdownShortcutPlugin,
    SandpackConfig,
    sandpackPlugin,
    ShowSandpackInfo,
    tablePlugin,
    thematicBreakPlugin, // Hr
    toolbarPlugin,
    UndoRedo,
    InsertTable,
    MDXEditorMethods, 
    
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import React, { useEffect, useState } from "react";
import { get, set } from "idb-keyval";

const defaultSnippetContent = `
export default function App() {
return (
<div className="App">
<h1>Hello CodeSandbox</h1>
<h2>Start editing to see some magic happen!</h2>
</div>
);
}
`.trim();

const simpleSandpackConfig: SandpackConfig = {
    defaultPreset: "react",
    presets: [
        {
            label: "React",
            name: "react",
            meta: "live react",
            sandpackTemplate: "react",
            sandpackTheme: "light",
            snippetFileName: "/App.js",
            snippetLanguage: "jsx",
            initialSnippetContent: defaultSnippetContent,
        },
    ],
};

async function imageUploadHandler(image: File) {
    const formData = new FormData();
    formData.append("image", image);
    // send the file to your server and return
    // the URL of the uploaded image in the response
    const response = await fetch("/uploads/new", {
        method: "POST",
        body: formData,
    });
    const json = (await response.json()) as { url: string };
    return json.url;
}

function App() {

    // FIXME: Markdown is not getting the initial values from indexedDB key value store.
    const [markdown, setMarkdown] = useState<string>("");
    const mdxEditorRef = React.useRef<MDXEditorMethods>(null)
    // Future me is gonna hate myself for writing this...
    useEffect(() => {
        get("markdown").then(
            (value) =>{ 
                setMarkdown(value)
                mdxEditorRef.current?.setMarkdown(value)
            });
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
         await set("markdown", markdown);
        }, 200);

        return () => {
            clearTimeout(timer);
        };
    }, [markdown]);
    
    return (
        <MDXEditor
            markdown={markdown}
            ref={mdxEditorRef}
            onChange={setMarkdown}
            plugins={[
                headingsPlugin(),
                thematicBreakPlugin(),
                listsPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                imagePlugin({
                    imageUploadHandler,
                }),
                codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
                tablePlugin(),
                sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
                markdownShortcutPlugin(),
                codeMirrorPlugin({
                    autoLoadLanguageSupport: true,
                    codeBlockLanguages: {
                        js: "JavaScript",
                        css: "CSS",
                        jsx: "Javascript (React)",
                        ts: "Typescript",
                        tsx: "Typescript (React)",
                        py: "Python",
                        rs: "Rust",
                        go: "Go",
                        java: "Java",
                        cpp: "C++",
                    },
                }),
                toolbarPlugin({
                    toolbarContents: () => (
                        <ConditionalContents
                            options={[
                                {
                                    when: (editor) =>
                                        editor?.editorType === "codeblock",
                                    contents: () => (
                                        <ChangeCodeMirrorLanguage />
                                    ),
                                },
                                {
                                    when: (editor) =>
                                        editor?.editorType === "sandpack",
                                    contents: () => <ShowSandpackInfo />,
                                },
                                {
                                    fallback: () => (
                                        <>
                                            <BlockTypeSelect />
                                            <UndoRedo />
                                            <BoldItalicUnderlineToggles />
                                            <ListsToggle />
                                            <InsertCodeBlock />
                                            <InsertSandpack />
                                            <InsertThematicBreak />
                                            <InsertImage />
                                            <CreateLink />
                                            <InsertTable />
                                        </>
                                    ),
                                },
                            ]}
                        />
                    ),
                }),
            ]}
        />
    );
}

export default App;
