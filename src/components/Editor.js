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
import userEvent from '@testing-library/user-event';

import CodeMirror from 'codemirror';
import beautify from '../lib/beautify';

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
    mode: { name: 'text/html', multilineTagIndentPastTag: false },
  },

  htmlmixed: {
    mode: { name: 'htmlmixed', multilineTagIndentPastTag: false },
  },

  javascript: {
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
  userEvent: Object.keys(userEvent).sort(),
};

function getQueryHints(cm) {
  const cursor = cm.getCursor();
  const line = cm.getLine(cursor.line);
  // const words = line.split(/\s/);
  // const word = words[words.length - 1];

  let start = cursor.ch;
  let end = cursor.ch;

  while (start && /\w|\./.test(line.charAt(start - 1))) {
    --start;
  }
  while (end < line.length && /\w|\./.test(line.charAt(end))) {
    ++end;
  }

  const word = line.slice(start, end); //.toLowerCase();
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
    const values = (suggestions[obj] || []).filter(
      (x) => x.includes(method), //x.toLowerCase().includes(method.toLowerCase()),
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

function formatValue(cm) {
  // sometimes the mode is stored under `mode` and other times under `mode.name` :/
  const mode = cm.options.mode.name || cm.options.mode;
  const value = cm.getValue();
  const formatted = beautify.format(mode, value);
  cm.setValue(formatted);
}

function autoComplete(cm, event) {
  const cursor = cm.getDoc().getCursor();
  const token = cm.getTokenAt(cursor);

  const shouldComplete =
    !cm.state.completionActive &&
    !NON_TRIGGER_KEYS[(event.keyCode || event.which).toString()] &&
    !(token.string === '(' || token.string === ')');

  if (shouldComplete) {
    CodeMirror.commands.autocomplete(cm, null, {
      completeSingle: false,
    });
  }
}

function handleChange(cm, change) {
  switch (change.origin) {
    case 'setValue':
      return;

    case 'paste': {
      formatValue(cm);
      cm.onChange(cm.getValue(), { origin: change.origin });
      const text = change.text;
      const textLastPos = text.length - 1;
      cm.getDoc().setCursor({
        line: change.to.line + textLastPos,
        ch: text[textLastPos].length,
      });
      break;
    }

    default: {
      cm.onChange(cm.getValue(), { origin: change.origin });
      break;
    }
  }
}

// with devtools open, the roundtrip between blur and result is about 200 ms.
// Close devtools, and it drops down to ~ 5 ms. If you're still getting weird
// user-event / fireEvent issues, it might be that either 25 or 500 ms is to low for
// your machine. Pumping up production timeouts can cause more side-effects, but
// I think we can quite safely increase to ~ 100 ms when neccasary. For the dev
// environment, I hope you can life with it. The worst thing that happens, is
// that the query editor loses focus while you're typing your userEvents.
const threshold = process.env.NODE_ENV === 'production' ? 25 : 500;

// There are two ways that the query editor can use blur. One is if the user
// decides to leave the editor. The other is caused by evaluating the users
// script. For example to focus one of the inputs in the sandbox, to enter
// some text, or click an element. If this happens, we need to restore focus
// as soon as possible. This is, when the SANDBOX_READY event occurs before
// the `threshold`ms timeout has passed.
function handleBlur(cm) {
  const cursor = cm.getCursor();
  let timeout;

  function listener({ data: { source, type } }) {
    if (source !== 'testing-playground-sandbox' || type !== 'SANDBOX_READY') {
      return;
    }

    // if we came to here, it means that the time between the `blur` event and
    // SANDBOX_READY msg was within `threshold` ms. Otherwise, the timeout would
    // already have removed this listener.
    clearTimeout(timeout);
    window.removeEventListener('message', listener);
    cm.focus();
    cm.setCursor(cursor);
  }

  // note, { once: true } doesn't work here! there can be multiple messages, while
  // we need one with a specific event attribute
  window.addEventListener('message', listener);

  // we wait a couple of ms for the SANDBOX_READY event, if that doesn't come
  // before given threshold, we assume the user left the editor, and allow it
  // lose focus.
  timeout = setTimeout(() => {
    window.removeEventListener('message', listener);
  }, threshold);
}

function Editor(props) {
  const { onLoad, onChange, mode, initialValue } = props;

  const elem = useRef();
  const editor = useRef();

  useEffect(() => {
    editor.current = CodeMirror.fromTextArea(elem.current, {
      ...baseOptions,
      ...options[mode],
      extraKeys: {
        'Ctrl-Enter': () => {
          editor.current.onChange(editor.current.getValue(), {
            origin: 'user',
          });
        },
        'Cmd-Enter': () => {
          editor.current.onChange(editor.current.getValue(), {
            origin: 'user',
          });
        },
        ...(options[mode].extraKeys || {}),
      },
    });

    editor.current.setValue(initialValue || '');

    editor.current.on('change', handleChange);
    editor.current.on('keyup', autoComplete);
    editor.current.on('blur', handleBlur);

    onLoad(editor.current);

    // in some cases, CM loads with a scrollbar visible
    // while it shouldn't be required. Requesting a refresh
    // fixes this
    requestAnimationFrame(() => {
      editor.current.refresh();
    });

    return () => {
      editor.current.off('change', handleChange);
      editor.current.off('keyup', autoComplete);
      editor.current.off('blur', handleBlur);
    };
  }, [mode, onLoad, initialValue]);

  useEffect(() => {
    editor.current.onChange = onChange;
  }, [onChange]);

  return (
    <div className="w-full h-full">
      <textarea ref={elem} />
    </div>
  );
}

export default Editor;
