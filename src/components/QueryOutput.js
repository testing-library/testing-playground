import React from 'react';
import Expandable from './Expandable';

function QueryOutput({ error, result }) {
  return (
    <Expandable
      className="query-result z-10 bg-gray-800 font-mono text-xs text-gray-100"
      variant="dark"
      labelText="query suggestion"
    >
      {error ? `Error: ${error}` : '> ' + (result || 'undefined')}
    </Expandable>
  );
}

export default React.memo(QueryOutput);
