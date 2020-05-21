import React, { useState, useRef, useEffect } from 'react';
import Editor from './Editor';
import ElementInfo from './ElementInfo';
import Header from './Header';
import Footer from './Footer';
import parser from '../parser';

import { initialValues } from '../constants';
import ensureArray from '../lib/ensureArray';
import { AppContextProvider, useAppContext } from './Context';
import HtmlPreview from './HtmlPreview';

let cycle = 0;

function App() {
  const [html, setHtml] = useState(initialValues.html);
  const [js, setJs] = useState(initialValues.js);

  const { htmlEditorRef, htmlPreviewRef, jsEditorRef } = useAppContext();

  const [result, setResult] = useState({});
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const parsed = parser.parse(htmlPreviewRef.current, js);
    setResult(parsed);

    const elements = ensureArray(parsed.code).filter(
      (x) => x?.nodeType === Node.ELEMENT_NODE,
    );

    cycle++;
    setElements(elements);
    elements.forEach((el) => el.classList.add('highlight'));

    return () => {
      elements.forEach((el) => el.classList.remove('highlight'));
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
              initialValue={initialValues.js}
              onChange={setJs}
              ref={jsEditorRef}
            />
            <div className="output">
              <span className="text-blue-600">&gt; </span>
              {result.text || result.error || 'undefined'}
            </div>
          </div>

          <div>
            <div>
              {elements.map((x, idx) => (
                <ElementInfo key={`${cycle}-${idx}`} element={x} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-8 pb-8">
        <Footer />
      </div>
    </div>
  );
}

export default App;
