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
      <div className="editor markup-editor gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2">
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

      <div className="editor gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2">
        <div className="flex-auto relative h-56 md:h-full">
          <Query query={query} result={result} dispatch={dispatch} />
        </div>

        <div className="flex-auto h-56 md:h-full">
          <div className="-mt-2 mb-1 flex-none space-x-4 text-gray-800 font-mono text-xs font-bold flex justify-between items-center">
            &nbsp;{' '}
            {/* I don't like this box being here, but I need a quick way to align this with the query editor*/}
          </div>
          <Result result={result} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}

export default Playground;
