import React from 'react';

function ErrorBox({ caption, body }) {
  return (
    <div className="bg-red-600 text-white p-4 rounded space-y-2 font-mono text-xs">
      <div className="font-bold text-xs">Error: {caption}</div>

      <div className="font-mono text-xs whitespace-pre-wrap">{body}</div>
    </div>
  );
}

export default ErrorBox;
