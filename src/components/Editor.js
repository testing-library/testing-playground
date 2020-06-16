import React, { useRef, useEffect } from 'react';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/hint/show-hint';
import { queries } from '@testing-library/dom';

import CodeMirror from 'codemirror';
import debounce from 'lodash/debounce';

const baseOptions = {
  autoCloseBrackets: true,
  autoCloseTags: true,
  autofocus: false,
  indent: 2,
  lineNumbers: true,
  lineWrapping: false,
  theme: 'dracula',
  scrollbarStyle: 'simple',
};

const options = {
  html: {
    ...baseOptions,
    mode: { name: 'text/html', multilineTagIndentPastTag: false },
  },

  htmlmixed: {
    ...baseOptions,
    mode: { name: 'htmlmixed', multilineTagIndentPastTag: false },
  },

  javascript: {
    ...baseOptions,
    mode: 'javascript',
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
    hintOptions: { hint: getQueryHints },
  },
};

const suggestions = {
  screen: Object.keys(queries)
    .filter((x) => x.startsWith('getBy'))
    .sort(),
  container: ['querySelector', 'querySelectorAll'],
};

function getQueryHints(cm) {
  const cursor = cm.getCursor();
  const line = cm.getLine(cursor.line);
  // const words = line.split(/\s/);
  // const word = words[words.length - 1];

  let start = cursor.ch;
  let end = cursor.ch;

  while (start && /\w|\./.test(line.charAt(start - 1))) --start;
  while (end < line.length && /\w|\./.test(line.charAt(end))) ++end;

  const word = line.slice(start, end).toLowerCase();
  const offset = word.lastIndexOf('.') + 1;
  const list = [];

  const lastChar = line[line.length - 1];
  // we don't support these a.t.m.
  if (lastChar === '(' || lastChar === ')' || lastChar === `'`) {
    return;
  }

  if (word.endsWith('.')) {
    // user entered the compelete object name, including . `screen.`
    const values = suggestions[word.substr(0, word.length - 1)] || [];
    list.push(...values);
  } else if (word.includes('.')) {
    // user is already one level deeper, entered `screen.get...`
    const [obj, method] = word.split('.');
    const values = (suggestions[obj] || []).filter((x) =>
      x.toLowerCase().includes(method),
    );
    list.push(...values);
  } else {
    // browsing the root level, user types something like `scr` -> `screen``
    const values = Object.keys(suggestions).filter((x) => x.startsWith(word));
    list.push(...values);
  }

  return {
    list: list,
    from: CodeMirror.Pos(cursor.line, start + offset),
    to: CodeMirror.Pos(cursor.line, end),
  };
}

// copy/edit from: https://stackoverflow.com/a/33908969/913810
const NON_TRIGGER_KEYS = {
  '8': 'backspace',
  '9': 'tab',
  '13': 'enter',
  '16': 'shift',
  '17': 'ctrl',
  '18': 'alt',
  '19': 'pause',
  '20': 'capslock',
  '27': 'escape',
  '32': 'space', // added
  '33': 'pageup',
  '34': 'pagedown',
  '35': 'end',
  '36': 'home',
  '37': 'left',
  '38': 'up',
  '39': 'right',
  '40': 'down',
  '45': 'insert',
  '46': 'delete',
  '91': 'left window key',
  '92': 'right window key',
  '93': 'select',
  '107': 'add',
  '109': 'subtract',
  '110': 'decimal point',
  '111': 'divide',
  '112': 'f1',
  '113': 'f2',
  '114': 'f3',
  '115': 'f4',
  '116': 'f5',
  '117': 'f6',
  '118': 'f7',
  '119': 'f8',
  '120': 'f9',
  '121': 'f10',
  '122': 'f11',
  '123': 'f12',
  '144': 'numlock',
  '145': 'scrolllock',
  '186': 'semicolon',
  '187': 'equalsign',
  '188': 'comma',
  '189': 'dash',
  // '190': 'period',
  '191': 'slash',
  '192': 'graveaccent',
  '220': 'backslash',
  '222': 'quote',
};

function Editor({ onLoad, onChange, mode, initialValue }) {
  const elem = useRef();
  const editor = useRef();

  useEffect(() => {
    editor.current = CodeMirror.fromTextArea(
      elem.current,
      options[mode] || baseOptions,
    );
    editor.current.setValue(initialValue || '');

    // in some cases, CM loads with a scrollbar visible
    // while it shouldn't be required. Requesting a refresh
    // fixes this
    requestAnimationFrame(() => {
      editor.current.refresh();
    });
  }, [mode]);

  useEffect(() => {
    if (!editor.current || typeof onChange !== 'function') return;

    editor.current.on(
      'changes',
      debounce(() => {
        onChange(editor.current.getValue());
      }, 25),
    );

    editor.current.on('keyup', (editor, event) => {
      const cursor = editor.getDoc().getCursor();
      const token = editor.getTokenAt(cursor);

      const shouldComplete =
        !editor.state.completionActive &&
        !NON_TRIGGER_KEYS[(event.keyCode || event.which).toString()] &&
        !(token.string === '(' || token.string === ')');

      if (shouldComplete) {
        CodeMirror.commands.autocomplete(editor, null, {
          completeSingle: false,
        });
      }
    });

    onLoad(editor.current);
  }, [editor.current, onChange]);

  return (
    <div className="w-full h-full">
      <textarea ref={elem} />
    </div>
  );
}

export default Editor;
