import React from 'react';

import Preview from './Preview';
import MarkupEditor from './MarkupEditor';
import Result from './Result';
import Query from './Query';
import usePlayground from '../hooks/usePlayground';
import state from '../lib/state';

function onStateChange({ markup, query, result }) {
  state.save({ markup, query });
  state.updateTitle(result?.expression?.expression);
}

const initialValues = state.load() || {};

function Playground() {
  const [{ markup, query, result }, dispatch] = usePlayground({
    onChange: onStateChange,
    ...initialValues,
  });

  return (
    <div className="flex flex-col h-auto md:h-full w-full">
      <div className="editor markup-editor p-4 gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2">
        <div className="flex-auto relative h-56 md:h-full">
          <MarkupEditor markup={markup} dispatch={dispatch} />
        </div>

        <div className="flex-auto h-56 md:h-full">
          <Preview
            markup={markup}
            elements={result.elements}
            accessibleRoles={result.accessibleRoles}
            dispatch={dispatch}
          />
        </div>
      </div>

      <div className="flex-none h-8" />

      <div className="editor px-4 pb-4 pt-8 gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2">
        <div className="flex-auto relative h-56 md:h-full">
          <Query query={query} result={result} dispatch={dispatch} />
        </div>

        <div className="flex-auto h-56 md:h-full overflow-hidden">
          <Result result={result} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}

export default Playground;
