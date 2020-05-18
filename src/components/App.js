import React, { useState, useRef, useEffect } from 'react';
import Editor from './Editor';
import ElementInfo from './ElementInfo';
import Title from './Title';
import parser from '../parser';

import { initialValues } from '../constants';
import ensureArray from '../lib/ensureArray';

let cycle = 0;

function App() {
  const [html, setHtml] = useState(initialValues.html);
  const [js, setJs] = useState(initialValues.js);
  const htmlRoot = useRef();

  const [result, setResult] = useState({});
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const parsed = parser.parse(htmlRoot.current, js);
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
  }, [html, js, htmlRoot.current]);

  return (
    <div>
      <Title />

      <div className="space-y-8 px-8 pb-8">
        <div className="editor">
          <Editor mode="html" initialValue={html} onChange={setHtml} />
          <div
            className="preview"
            ref={htmlRoot}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <div className="editor">
          <div>
            <Editor
              mode="javascript"
              initialValue={initialValues.js}
              onChange={setJs}
            />
            <div className="output">
              <span className="text-blue-600">&gt; </span>
              {result.text || result.error || 'undefined'}
            </div>
          </div>

          <div>
            <div>
              {elements.map((x, idx) => (
                <ElementInfo
                  key={`${cycle}-${idx}`}
                  root={htmlRoot.current}
                  element={x}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
