// "use client";
// import "@/lib/CustomVideoBlot";
// import React, { useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import "react-quill/dist/quill.snow.css";
// const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

// export function TextEditor({
//   onChange,
//   defaultValue,
//   placeholder,
//   error,
//   isBlog,
// }: {
//   onChange: (value: string) => void;
//   defaultValue?: string;
//   placeholder?: string;
//   error?: string;
//   isBlog?: boolean;
// }) {
//   const CustomUndo = () => (
//     <svg viewBox="0 0 18 18">
//       <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
//       <path
//         className="ql-stroke"
//         d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
//       />
//     </svg>
//   );

//   // Redo button icon component for Quill editor
//   const CustomRedo = () => (
//     <svg viewBox="0 0 18 18">
//       <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
//       <path
//         className="ql-stroke"
//         d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
//       />
//     </svg>
//   );

//   const quillRef = useRef<any | null>(null);

//   const handleVideoEmbed = () => {
//     const url = prompt("Enter YouTube URL");
//     if (!url) return;

//     const match = url.match(
//       /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu.be\/)([^\s&]+)/
//     );

//     if (match && match[1]) {
//       const embedUrl = `https://www.youtube.com/embed/${match[1]}`;
//       const quill = quillRef.current?.getEditor();
//       const range = quill?.getSelection(true);
//       quill?.insertEmbed(range?.index || 0, "video", embedUrl);
//       quill?.setSelection((range?.index || 0) + 1);
//     } else {
//       alert("Please enter a valid YouTube URL");
//     }
//   };

//   const quillModules = {
//     toolbar: {
//       container: [
//         ["bold", "italic", "underline", "strike"],
//         ["blockquote"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         [{ script: "sub" }, { script: "super" }],
//         [{ indent: "-1" }, { indent: "+1" }],
//         [{ header: [1, 2, 3, 4, 5, 6, false] }],
//         [{ color: [] }, { background: [] }],
//         [
//           {
//             font: ["montserrat"],
//           },
//         ],
//         ["link"], //  "video"
//         ["clean"],
//         ["undo", "redo"],
//       ],
//       handlers: {
//         video: handleVideoEmbed,
//       },
//     },
//     history: {
//       delay: 500,
//       maxStack: 100,
//       userOnly: true,
//     },
//   };

//   const quillBlogModules = {
//     toolbar: {
//       container: [
//         ["bold", "italic", "underline", "strike"],
//         ["blockquote"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         [{ script: "sub" }, { script: "super" }],
//         [{ indent: "-1" }, { indent: "+1" }],
//         //   [{ direction: "rtl" }],
//         [{ header: [1, 2, 3, 4, 5, 6, false] }],
//         [{ color: [] }, { background: [] }],
//         [
//           {
//             font: [],
//           },
//         ],
//         //  [{ align: [] }],
//         ["link", "image", "video"], //  "video"
//         ["clean"],
//         ["undo", "redo"],

//         // ["imageResize", "imageTextAlternative"],
//       ],
//     },
//     history: {
//       delay: 500,
//       maxStack: 100,
//       userOnly: true,
//     },
//   };

//   const quillFormats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "list",
//     "bullet",
//     "link",
//     "image",
//     "color",
//     "code-block",
//     "undo",
//     "redo",
//     "imageResize",
//     "clean",
//     "code-block",
//     "imageTextAlternative",
//     "font",
//     "size",
//     "background",
//     "indent",
//     "list",
//     "script",
//   ];

//   const [content, setContent] = useState(defaultValue);
//   const [isFocused, setIsFocused] = useState(false);
//   const handleEditorChange = (content: string) => {
//     setContent(content);
//     onChange(content);
//   };

//   return (
//     <div className="w-full interaction-input" ref={quillRef}>
//       <QuillEditor
//         style={{ fontFamily: "Montserrat, sans-serif" }}
//         onBlur={() => setIsFocused(true)}
//         onFocus={() => setIsFocused(false)}
//         value={content}
//         onChange={(e) => {
//           handleEditorChange(e);
//         }}
//         modules={isBlog ? quillBlogModules : quillModules}
//         formats={quillFormats}
//         theme="snow"
//         placeholder={placeholder || "Enter description"}
//         className="w-full  ql-container focus:ring-1"
//       />
//       {error && <p className="text-xs textred-500 mt-2">{error}</p>}
//     </div>
//   );
// }

import React, { useEffect } from 'react';
import { $getRoot, $getSelection, type EditorState } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

const theme = {};

function onError(error: unknown) {
  throw error;
}

function onChange(editorState: EditorState) {
  editorState.read(() => {
    const root = $getRoot();
    const selection = $getSelection();
    console.log(root, selection);
  });
}

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
}

export default function Editor() {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={
          <ContentEditable className="relative border border-gray-300 rounded p-2 min-h-[100px]" />
        }
        placeholder={
          <span className="absolute top-2 left-2 text-gray-400 pointer-events-none">
            Enter some text...
          </span>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
      <MyCustomAutoFocusPlugin />
    </LexicalComposer>
  );
}
