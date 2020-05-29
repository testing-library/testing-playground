import React, { useEffect } from 'react';

import usePlayground from '../hooks/usePlayground';
import state from '../lib/state';
import { initialValues } from '../constants';

import Preview from './Preview';
import MarkupEditor from './MarkupEditor';
import Result from './Result';
import Query from './Query';

const savedState = state.load();

function Playground() {
  const [query, setQuery, markup, setMarkup] = usePlayground({
    initialMarkup: initialValues.html || savedState.markup,
    initialQuery: initialValues.js || savedState.js,
  });
  useEffect(() => {
    state.save({ markup, query });
  }, [markup, query]);

  return (
    <div className="flex flex-col h-auto md:h-full w-full">
      <div className="editor markup-editor gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2">
        <div className="flex-auto relative h-56 md:h-full">
          <MarkupEditor onChange={setMarkup} initialValue={markup} />
        </div>

        <div className="flex-auto h-56 md:h-full">
          <Preview html={markup} />
        </div>
      </div>

      <div className="flex-none h-8" />

      <div className="editor gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="flex-auto relative h-56 md:h-full">
          <Query onChange={setQuery} initialValue={query} />
        </div>

        <div className="flex-auto h-56 md:h-full overflow-hidden">
          <Result />
        </div>
      </div>
    </div>
  );
}

export default Playground;
