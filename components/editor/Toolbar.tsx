import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
} from 'lexical';

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const onBoldClick = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const onItalicClick = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const onUnderlineClick = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  return (
    <div className="flex gap-2 border-b border-gray-300 p-2">
      <button onClick={onBoldClick} className="px-2 py-1 border rounded">
        Bold
      </button>
      <button onClick={onItalicClick} className="px-2 py-1 border rounded">
        Italic
      </button>
      <button onClick={onUnderlineClick} className="px-2 py-1 border rounded">
        Underline
      </button>
    </div>
  );
}
