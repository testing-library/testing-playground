import React from 'react';
import Expandable from './Expandable';

function PreviewHint({ roles, suggestion }) {
  const expression = suggestion?.snippet ? (
    suggestion.snippet
  ) : (
    <div>
      <span className="font-bold">accessible roles: </span>
      {roles.join(', ')}
    </div>
  );

  const excerpt = suggestion?.excerpt ? `> ${suggestion.excerpt}` : expression;

  const snapshot = suggestion?.snapshot && (
    <div className="snapshot">
      <div className="py-1">&nbsp;</div>
      <span className="font-bold">Snapshot </span>
      <div className="py-1">&nbsp;</div>
      <div>{suggestion.snapshot}</div>
    </div>
  );

  return (
    <Expandable
      excerpt={excerpt}
      className="rounded fle bg-gray-200 font-mono text-xs text-gray-800"
      labelText="html preview"
    >
      {expression}
      {snapshot}
    </Expandable>
  );
}

export default React.memo(PreviewHint);
