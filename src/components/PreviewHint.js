import React from 'react';
import Expandable from './Expandable';

function PreviewHint({ roles, suggestion }) {
  const expression = suggestion.expression ? (
    `> ${suggestion.expression}`
  ) : (
    <>
      <span className="font-bold">accessible roles: </span>
      {roles.join(', ')}
    </>
  );

  return (
    <Expandable className="bg-gray-200 text-gray-800 font-mono text-xs rounded fle">
      {expression}
    </Expandable>
  );
}

export default React.memo(PreviewHint);
