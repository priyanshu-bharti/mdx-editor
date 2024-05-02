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
    InsertTable, //
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useState } from "react";

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
    const [markdown, setMarkdown] = useState("Start typing here...");

    return (
        <MDXEditor
            markdown={markdown}
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
