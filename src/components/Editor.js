import React, { useRef, useEffect } from 'react';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/addon/fold/xml-fold.js';

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
};

const options = {
  html: {
    ...baseOptions,
    mode: 'text/html',
  },

  javascript: {
    ...baseOptions,
    mode: 'javascript',
  },
};

function Editor({ onChange, mode, initialValue }, forwardRef) {
  const elem = useRef();
  const localRef = useRef();
  const editor = forwardRef || localRef;

  useEffect(() => {
    editor.current = CodeMirror.fromTextArea(
      elem.current,
      options[mode] || baseOptions,
    );
    editor.current.setValue(initialValue || '');
  }, [mode]);

  useEffect(() => {
    if (!editor.current || typeof onChange !== 'function') return;

    editor.current.on(
      'changes',
      debounce(() => {
        onChange(editor.current.getValue());
      }, 25),
    );
  }, [editor.current, onChange]);

  return <textarea ref={elem} />;
}

export default React.forwardRef(Editor);
