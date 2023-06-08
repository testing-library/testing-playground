import React from 'react';
import Scrollable from './Scrollable';

function ErrorBox({ caption, body }) {
  return (
    <div className="rounded h-full w-full bg-red-600 font-mono text-xs text-white">
      <Scrollable variant="error">
        <div>
          <div className="p-4 text-xs font-bold">Error: {caption}</div>

          <div className="whitespace-pre-wrap p-4 font-mono text-xs">
            {body}
          </div>
        </div>
      </Scrollable>
    </div>
  );
}

export default ErrorBox;
