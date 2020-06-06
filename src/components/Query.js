import React from 'react';
import QueryEditor from './QueryEditor';
import QueryOutput from './QueryOutput';

function Query({ query, result, dispatch }) {
  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="query-editor flex-auto relative overflow-hidden">
        <QueryEditor query={query} dispatch={dispatch} />
      </div>

      <QueryOutput error={result.error?.message} result={result.formatted} />
    </div>
  );
}

export default Query;
