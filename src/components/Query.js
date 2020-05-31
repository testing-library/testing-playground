import React from 'react';
import QueryEditor from './QueryEditor';
import QueryOutput from './QueryOutput';
import { usePlayground } from './Context';

function Query({ onChange, initialValue }) {
  const { state } = usePlayground();

  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="query-editor flex-auto relative overflow-hidden">
        <QueryEditor initialValue={initialValue} onChange={onChange} />
      </div>

      <QueryOutput
        error={state.result.error?.message}
        result={state.result.formatted}
      />
    </div>
  );
}

export default Query;
