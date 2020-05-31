import React, { useState, useEffect } from 'react';
import parser from '../parser';

import { useAppContext } from './Context';
import Preview from './Preview';
import MarkupEditor from './MarkupEditor';
import Result from './Result';

import { initialValues } from '../constants';
import state from '../lib/state';
import Query from './Query';

const savedState = state.load();

function Playground() {
  const [html, setHtml] = useState(savedState.markup || initialValues.html);
  const [js, setJs] = useState(savedState.query || initialValues.js);

  const { setParsed } = useAppContext();

  useEffect(() => {
    const parsed = parser.parse({ markup: html, query: js });
    setParsed(parsed);

    state.save({ markup: html, query: js });
    state.updateTitle(parsed.expression?.expression);
  }, [html, js]);

  return (
    <div className="flex flex-col h-auto md:h-full w-full">
      <div className="editor markup-editor gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2">
        <div className="flex-auto relative h-56 md:h-full">
          <MarkupEditor onChange={setHtml} initialValue={html} />
        </div>

        <div className="flex-auto h-56 md:h-full">
          <Preview html={html} />
        </div>
      </div>

      <div className="flex-none h-8" />

      <div className="editor gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="flex-auto relative h-56 md:h-full">
          <Query onChange={setJs} initialValue={js} />
        </div>

        <div className="flex-auto h-56 md:h-full overflow-hidden">
          <Result />
        </div>
      </div>
    </div>
  );
}

export default Playground;
