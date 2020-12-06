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
      className="bg-gray-200 text-gray-800 font-mono text-xs rounded fle"
      data-testid="preview"
    >
      {expression}
      {snapshot}
    </Expandable>
  );
}

export default React.memo(PreviewHint);
