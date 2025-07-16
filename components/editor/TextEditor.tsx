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

"use client";

import React from "react";
import { $getRoot, type EditorState } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import Toolbar from "./Toolbar";
import ImagesPlugin from "./ImagePlugin";

import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { ImageNode } from "./ImageNode"; // adjust path

import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { YouTubeNode } from "./YoutubeNode";


type EditorProps = {
  onChange?: (content: string) => void;
};

export default function Editor({ onChange }: EditorProps) {
  const theme = {};

  function onError(error: unknown) {
    throw error;
  }

  function handleChange(editorState: EditorState) {
    editorState.read(() => {
      const root = $getRoot();
      const content = root.getTextContent();
      if (onChange) {
        onChange(content);
      }
    });
  }

  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [ListNode, ListItemNode, LinkNode, ImageNode, YouTubeNode], // ✅ REGISTERED NODES
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Toolbar />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="relative border border-gray-300 rounded p-2 min-h-[150px] h-[50vh] outline-none" />
        }
        placeholder={
          <span className="absolute top-2 left-2 text-gray-400 pointer-events-none">
            Enter some rich text...
          </span>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={handleChange} />
      <HistoryPlugin />
      <ImagesPlugin />
      <ListPlugin />    {/* ✅ enables lists */}
      <LinkPlugin />    {/* ✅ enables links */}
    </LexicalComposer>
  );
}
