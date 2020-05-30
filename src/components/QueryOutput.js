import React from 'react';
import Expandable from './Expandable';

function QueryOutput({ error, result }) {
  return (
    <Expandable
      className="query-result bg-gray-800 text-gray-100 font-mono text-xs z-10"
      variant="dark"
    >
      {error ? `Error: ${error}` : '> ' + (result || 'undefined')}
    </Expandable>
  );
}

export default QueryOutput;
