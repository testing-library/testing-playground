import React from 'react';
import QueryEditor from './QueryEditor';
import QueryOutput from './QueryOutput';
import { useAppContext } from './Context';

function Query({ onChange, initialValue }) {
  const { parsed } = useAppContext();

  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="query-editor flex-auto relative overflow-hidden">
        <QueryEditor initialValue={initialValue} onChange={onChange} />
      </div>

      <QueryOutput error={parsed.error} result={parsed.text} />
    </div>
  );
}

export default Query;
