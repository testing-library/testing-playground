import React, { useState, useEffect } from 'react';
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

    parsed.targets?.forEach((el) => el.classList.add('highlight'));
    state.save({ html, js });

    return () => {
      parsed.targets?.forEach((el) => el.classList.remove('highlight'));
    };
  }, [html, js, htmlPreviewRef.current]);

  return (
    <div>
      <div className="mb-8">
        <Header />
      </div>

      <div className="space-y-8 px-8 pb-8">
        <div className="editor">
          <Editor
            mode="html"
            initialValue={html}
            onChange={setHtml}
            ref={htmlEditorRef}
          />
          <HtmlPreview html={html} ref={htmlPreviewRef} />
        </div>

        <div className="editor">
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
