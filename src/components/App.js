import React, { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import Editor from './Editor';
import ElementInfo from './ElementInfo';
import Header from './Header';
import Footer from './Footer';
import parser from '../parser';

import { initialValues } from '../constants';
import { useAppContext } from './Context';
import HtmlPreview from './HtmlPreview';
import state from '../lib/state';

const savedState = state.load();

function App() {
  const [html, setHtml] = useState(savedState.html || initialValues.html);
  const [js, setJs] = useState(savedState.js || initialValues.js);

  const {
    htmlEditorRef,
    htmlPreviewRef,
    jsEditorRef,
    parsed,
    setParsed,
  } = useAppContext();

  useEffect(() => {
    const parsed = parser.parse(htmlPreviewRef.current, js);
    setParsed(parsed);

    state.save({ html, js });
    state.updateTitle(parsed.expression?.expression);
  }, [html, js, htmlPreviewRef.current]);

  return (
    <div>
      <div className="mb-8">
        <Header />
      </div>

      <div className="space-y-8 px-8 pb-8">
        <div className="editor lg:grid-cols-2 sm:grid-cols-1">
          <Editor
            mode="html"
            initialValue={html}
            onChange={setHtml}
            ref={htmlEditorRef}
          />
          <HtmlPreview html={html} ref={htmlPreviewRef} />
        </div>

        <div className="editor lg:grid-cols-2 sm:grid-cols-1">
          <div>
            <Editor
              mode="javascript"
              initialValue={js}
              onChange={setJs}
              ref={jsEditorRef}
            />
            <div className="output">
              <span className="text-blue-600">&gt; </span>
              {parsed.text || parsed.error || 'undefined'}
            </div>
          </div>

          <ElementInfo />
        </div>
      </div>

      <div className="mx-8 pb-8">
        <Footer />
      </div>
    </div>
  );
}

export default App;
