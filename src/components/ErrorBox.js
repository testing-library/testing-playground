import React from 'react';
import Scrollable from './Scrollable';

function ErrorBox({ caption, body }) {
  return (
    <div className="w-full h-full bg-red-600 text-white rounded font-mono text-xs">
      <Scrollable variant="error">
        <div>
          <div className="font-bold text-xs p-4">Error: {caption}</div>

          <div className="font-mono text-xs whitespace-pre-wrap p-4">
            {body}
          </div>
        </div>
      </Scrollable>
    </div>
  );
}

export default ErrorBox;
