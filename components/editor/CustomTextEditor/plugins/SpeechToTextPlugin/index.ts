//

import type {LexicalCommand, LexicalEditor, RangeSelection} from 'lexical';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {useEffect, useRef, useState} from 'react';




const VOICE_COMMANDS: Readonly<
  Record<
    string,
    (arg0: {editor: LexicalEditor; selection: RangeSelection}) => void
  >
> = {
  '\n': ({selection}) => {
    selection.insertParagraph();
  },
  redo: ({editor}) => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  },
  undo: ({editor}) => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  },
};






