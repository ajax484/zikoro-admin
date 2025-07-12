"use client";
import "@/lib/CustomVideoBlot";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

export function TextEditor({
  onChange,
  defaultValue,
  placeholder,
  error,
  isBlog,
}: {
  onChange: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  isBlog?: boolean;
}) {
  const CustomUndo = () => (
    <svg viewBox="0 0 18 18">
      <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
      <path
        className="ql-stroke"
        d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
      />
    </svg>
  );

  // Redo button icon component for Quill editor
  const CustomRedo = () => (
    <svg viewBox="0 0 18 18">
      <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
      <path
        className="ql-stroke"
        d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
      />
    </svg>
  );

  const quillRef = useRef<any | null>(null);

  const handleVideoEmbed = () => {
    const url = prompt("Enter YouTube URL");
    if (!url) return;

    const match = url.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu.be\/)([^\s&]+)/
    );

    if (match && match[1]) {
      const embedUrl = `https://www.youtube.com/embed/${match[1]}`;
      const quill = quillRef.current?.getEditor();
      const range = quill?.getSelection(true);
      quill?.insertEmbed(range?.index || 0, "video", embedUrl);
      quill?.setSelection((range?.index || 0) + 1);
    } else {
      alert("Please enter a valid YouTube URL");
    }
  };

  const quillModules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [
          {
            font: ["montserrat"],
          },
        ],
        ["link"], //  "video"
        ["clean"],
        ["undo", "redo"],
      ],
      handlers: {
        video: handleVideoEmbed,
      },
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
  };

  const quillBlogModules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        //   [{ direction: "rtl" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [
          {
            font: [],
          },
        ],
        //  [{ align: [] }],
        ["link", "image", "video"], //  "video"
        ["clean"],
        ["undo", "redo"],

        // ["imageResize", "imageTextAlternative"],
      ],
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "color",
    "code-block",
    "undo",
    "redo",
    "imageResize",
    "clean",
    "code-block",
    "imageTextAlternative",
    "font",
    "size",
    "background",
    "indent",
    "list",
    "script",
  ];

  const [content, setContent] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const handleEditorChange = (content: string) => {
    setContent(content);
    onChange(content);
  };

  return (
    <div className="w-full interaction-input" ref={quillRef}>
      <QuillEditor
        style={{ fontFamily: "Montserrat, sans-serif" }}
        onBlur={() => setIsFocused(true)}
        onFocus={() => setIsFocused(false)}
        value={content}
        onChange={(e) => {
          handleEditorChange(e);
        }}
        modules={isBlog ? quillBlogModules : quillModules}
        formats={quillFormats}
        theme="snow"
        placeholder={placeholder || "Enter description"}
        className="w-full  ql-container focus:ring-1"
      />
      {error && <p className="text-xs textred-500 mt-2">{error}</p>}
    </div>
  );
}





// "use client";

// import React from "react";
// import { ContentEditable } from "@lexical/react/LexicalContentEditable";
// import { LexicalComposer } from "@lexical/react/LexicalComposer";
// import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
// import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
// import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
// import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
// import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
// import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
// import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
// import { TRANSFORMERS } from "@lexical/markdown";
// import { $generateHtmlFromNodes } from "@lexical/html";

// import { LinkNode } from "@lexical/link";
// import {
//   TableNode,
//   TableRowNode,
//   TableCellNode,
// } from "@lexical/table";
// import { ListNode, ListItemNode } from "@lexical/list";
// import { HeadingNode, QuoteNode } from "@lexical/rich-text";
// import { VideoNode } from "./CustomVideoNode";
// import { ToolbarPlugin } from "./ToolbarPlugin";

// type Props = {
//   onChange: (value: string) => void;
//   defaultValue?: string;
//   placeholder?: string;
//   error?: string;
// };

// export function TextEditor({
//   onChange,
//   defaultValue = "",
//   placeholder = "Start writing your blog...",
//   error,
// }: Props) {
//   const initialConfig = {
//     namespace: "BlogEditor",
//     theme: {
//       paragraph: "editor-paragraph",
//     },
//     onError(error: any) {
//       console.error(error);
//     },
//     nodes: [
//       LinkNode,
//       TableNode,
//       TableRowNode,
//       TableCellNode,
//       ListNode,
//       ListItemNode,
//       HeadingNode,
//       QuoteNode, // ✅ Added QuoteNode for Markdown support
//       VideoNode,
//     ],
//   };

//   return (
//     <div className="w-full interaction-input relative">
//       <LexicalComposer initialConfig={initialConfig}>
//         <div className="border rounded p-2 min-h-[300px] relative bg-white">
//           <ToolbarPlugin />
//           <RichTextPlugin
//             contentEditable={
//               <ContentEditable className="w-full outline-none min-h-[300px] px-2 py-1" />
//             }
//             placeholder={<div className="text-gray-400 absolute">{placeholder}</div>}
//             ErrorBoundary={LexicalErrorBoundary}
//           />
//           <HistoryPlugin />
//           <LinkPlugin />
//           <TablePlugin />
//           <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
//           <OnChangePlugin
//             onChange={(editorState, editor) => {
//               editorState.read(() => {
//                 const html = $generateHtmlFromNodes(editor, null);
//                 onChange(html);
//               });
//             }}
//           />
//         </div>
//       </LexicalComposer>
//       {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
//     </div>
//   );
// }
