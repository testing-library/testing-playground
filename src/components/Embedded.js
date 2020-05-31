import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import usePlayground from '../hooks/usePlayground';
import { initialValues } from '../constants';
import state from '../lib/state';

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
  const [query, setQuery, markup, setMarkup, parsed] = usePlayground({
    initialMarkup: initialValues.html || savedState.markup,
    initialQuery: initialValues.js || savedState.js,
  });

  useEffect(() => {
    state.save({ markup, query });
    state.updateTitle(parsed?.expression?.expression);
  }, [markup, query]);

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
            return <Preview key={area} html={markup} />;
          case 'markup':
            return (
              <MarkupEditor
                key={area}
                onChange={setMarkup}
                initialValue={markup}
              />
            );
          case 'query':
            return (
              <Query key={area} initialValue={query} onChange={setQuery} />
            );
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
