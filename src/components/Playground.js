import React from 'react';

import Preview from './Preview';
import MarkupEditor from './MarkupEditor';
import Result from './Result';
import Query from './Query';
import { PlaygroundProvider } from './Context';
import state from '../lib/state';

function onStateChange({ markup, query, result }) {
  state.save({ markup, query });
  state.updateTitle(result?.expression?.expression);
}

const initialValues = state.load();

function Playground() {
  return (
    <PlaygroundProvider onChange={onStateChange} initialValues={initialValues}>
      <div className="flex flex-col h-auto md:h-full w-full">
        <div className="editor markup-editor gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2">
          <div className="flex-auto relative h-56 md:h-full">
            <MarkupEditor />
          </div>

          <div className="flex-auto h-56 md:h-full">
            <Preview />
          </div>
        </div>

        <div className="flex-none h-8" />

        <div className="editor gap-4 md:gap-8 md:h-56 flex-auto grid-cols-1 md:grid-cols-2 overflow-hidden">
          <div className="flex-auto relative h-56 md:h-full">
            <Query />
          </div>

          <div className="flex-auto h-56 md:h-full overflow-hidden">
            <Result />
          </div>
        </div>
      </div>
    </PlaygroundProvider>
  );
}

export default Playground;
