import React from 'react';
import Expandable from './Expandable';

function PreviewHint({ roles, suggestion }) {
  const expression = suggestion.expression ? (
    `> ${suggestion.expression}`
  ) : (
    <div>
      <span className="font-bold">accessible roles: </span>
      {roles.join(', ')}
    </div>
  );

  const snapshot = suggestion.snapshot && (
    <div className="snapshot">
      <div className="py-1">&nbsp;</div>
      <span className="font-bold">Snapshot </span>
      <div className="py-1">&nbsp;</div>
      <div>{suggestion.snapshot}</div>
    </div>
  );

  return (
    <Expandable className="bg-gray-200 text-gray-800 font-mono text-xs rounded fle">
      {expression}
      {snapshot}
    </Expandable>
  );
}

export default React.memo(PreviewHint);
