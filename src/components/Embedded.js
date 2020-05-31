import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { initialValues } from '../constants';
import parser from '../parser';
import state from '../lib/state';

import { useAppContext } from './Context';
import Preview from './Preview';
import Query from './Query';
import Result from './Result';
import MarkupEditor from './MarkupEditor';

const savedState = state.load();

const SUPPORTED_PANES = {
  markup: true,
  preview: true,
  query: true,
  result: true,
};

// TODO: we should support readonly mode
function Embedded() {
  const [html, setHtml] = useState(savedState.markup || initialValues.html);
  const [js, setJs] = useState(savedState.query || initialValues.js);
  const { setParsed } = useAppContext();

  const location = useLocation();
  const params = queryString.parse(location.search);

  const panes = params.panes
    ? Array.from(new Set(params.panes.split(',')))
        .map((x) => x.trim())
        .filter((x) => SUPPORTED_PANES[x])
    : ['markup', 'preview', 'query', 'result'];

  // TODO: we should add tabs to handle > 2 panes
  const areaCount = panes.length;

  // Yes, it looks like we could compose this like `grid-cols-${n}`, but that way it isn't detectable by purgeCss
  const columnClass =
    areaCount === 4
      ? 'grid-cols-4'
      : areaCount === 3
      ? 'grid-cols-3'
      : areaCount === 2
      ? 'grid-cols-2'
      : 'grid-cols-1';

  useEffect(() => {
    const parsed = parser.parse({ markup: html, query: js });
    setParsed(parsed);

    state.save({ markup: html, query: js });
    state.updateTitle(parsed.expression?.expression);
  }, [html, js]);

  useEffect(() => {
    document.body.classList.add('embedded');
    return () => document.body.classList.remove('embedded');
  }, []);

  return (
    <div
      className={`h-full overflow-hidden grid grid-flow-col gap-4 p-4 bg-white shadow rounded ${columnClass}`}
    >
      {panes.map((area) => {
        switch (area) {
          case 'preview':
            return <Preview key={area} html={html} />;
          case 'markup':
            return (
              <MarkupEditor key={area} onChange={setHtml} initialValue={html} />
            );
          case 'query':
            return <Query key={area} initialValue={js} onChange={setJs} />;
          case 'result':
            return <Result key={area} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

export default Embedded;
