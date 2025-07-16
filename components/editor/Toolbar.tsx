// "use client";

// import React from "react";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { FORMAT_TEXT_COMMAND } from "lexical";
// import {
//   INSERT_UNORDERED_LIST_COMMAND,
//   INSERT_ORDERED_LIST_COMMAND,
//   REMOVE_LIST_COMMAND,
// } from "@lexical/list";
// import { TOGGLE_LINK_COMMAND } from "@lexical/link";
// import { INSERT_IMAGE_COMMAND } from "./ImagePlugin"; // Adjust path if needed

// export default function Toolbar() {
//   const [editor] = useLexicalComposerContext();

//   const onBoldClick = () => {
//     editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
//   };

//   const onItalicClick = () => {
//     editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
//   };

//   const onUnderlineClick = () => {
//     editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
//   };

//   const onBulletListClick = () => {
//     editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
//   };

//   const onNumberedListClick = () => {
//     editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
//   };

//   const onRemoveListClick = () => {
//     editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
//   };

//   const onInsertLinkClick = () => {
//     const url = prompt("Enter URL");
//     if (!url) return;
//     editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
//   };

//   const onInsertImageClick = () => {
//     const url = prompt("Enter image or GIF URL");
//     if (!url) return;
//     editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: url, altText: "Inserted image" });
//   };

//   return (
//     <div className="flex flex-wrap gap-2 border-b border-gray-300 p-2">
//       <button onClick={onBoldClick} className="px-2 py-1 border rounded">Bold</button>
//       <button onClick={onItalicClick} className="px-2 py-1 border rounded">Italic</button>
//       <button onClick={onUnderlineClick} className="px-2 py-1 border rounded">Underline</button>
//       <button onClick={onBulletListClick} className="px-2 py-1 border rounded">Bullet List</button>
//       <button onClick={onNumberedListClick} className="px-2 py-1 border rounded">Numbered List</button>
//       <button onClick={onRemoveListClick} className="px-2 py-1 border rounded">Remove List</button>
//       <button onClick={onInsertLinkClick} className="px-2 py-1 border rounded">Insert Link</button>
//       <button onClick={onInsertImageClick} className="px-2 py-1 border rounded">Insert Image/GIF</button>
//     </div>
//   );
// }



"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $getSelection } from "lexical";
import { YouTubeNode } from "./YoutubeNode";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const onBoldClick = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const onItalicClick = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  const onUnderlineClick = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  };

  const onBulletListClick = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const onNumberListClick = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const onRemoveListClick = () => {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  };

  const onLinkClick = () => {
    const url = window.prompt("Enter link URL");
    if (url !== null) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  const onInsertYouTube = () => {
    const url = window.prompt("Enter YouTube URL");
    if (!url) return;

    // Extract YouTube ID
    const match = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoID = match ? match[1] : null;

    if (!videoID) {
      alert("Invalid YouTube URL");
      return;
    }

    editor.update(() => {
      const selection = $getSelection();
      if (selection !== null) {
        const node = new YouTubeNode(videoID);
        selection.insertNodes([node]);
      }
    });
  };

  return (
    <div className="flex gap-2 border-b border-gray-300 p-2">
      <button onClick={onBoldClick}>Bold</button>
      <button onClick={onItalicClick}>Italic</button>
      <button onClick={onUnderlineClick}>Underline</button>
      <button onClick={onBulletListClick}>Bullet List</button>
      <button onClick={onNumberListClick}>Numbered List</button>
      <button onClick={onRemoveListClick}>Remove List</button>
      <button onClick={onLinkClick}>Link</button>
      <button onClick={onInsertYouTube}>YouTube</button>
    </div>
  );
}
