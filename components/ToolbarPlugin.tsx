"use client";

import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $createParagraphNode,
  $insertNodes,
} from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $createVideoNode } from "./CustomVideoNode";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const toggleFormat = (formatType: "bold" | "italic" | "underline") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText(formatType);
      }
    });
  };

  const insertLink = () => {
    const url = prompt("Enter URL");
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  const insertYouTubeVideo = () => {
    const url = prompt("Enter YouTube URL");
    if (!url) return;

    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu.be\/)([^\s&]+)/);
    if (match && match[1]) {
      const embedUrl = `https://www.youtube.com/embed/${match[1]}`;
      editor.update(() => {
        const videoNode = $createVideoNode(embedUrl);
        $insertNodes([videoNode, $createParagraphNode()]);
      });
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const insertHeading = (tag: HeadingTagType) => {
    editor.update(() => {
      const headingNode = $createHeadingNode(tag);
      $insertNodes([headingNode]);
    });
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { "font-family": font });
      }
    });
  };

  return (
    <div className="flex gap-2 mb-2 flex-wrap">
      <button onClick={() => toggleFormat("bold")}>Bold</button>
      <button onClick={() => toggleFormat("italic")}>Italic</button>
      <button onClick={() => toggleFormat("underline")}>Underline</button>
      <button onClick={insertLink}>Link</button>
      <button onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>• List</button>
      <button onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>1. List</button>
      <button onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}>Remove List</button>
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: "3", rows: "3" })
        }
      >
        Table
      </button>
      <button onClick={insertYouTubeVideo}>YouTube</button>
      <button onClick={() => insertHeading("h1")}>H1</button>
      <button onClick={() => insertHeading("h2")}>H2</button>
      <button onClick={() => insertHeading("h3")}>H3</button>

      <select onChange={handleFontChange} defaultValue="">
        <option value="">Font</option>
        <option value="Montserrat">Montserrat</option>
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Courier New">Courier New</option>
        <option value="Times New Roman">Times New Roman</option>
      </select>
    </div>
  );
}
