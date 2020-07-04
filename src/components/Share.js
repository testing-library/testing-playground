import React from 'react';
import Input from './Input';
import CopyButton from './CopyButton';

function Share({ dirty }) {
  return (
    <div className="settings text-sm pb-2">
      <div>
        <h3 className="text-sm font-bold mb-2">Share</h3>

        {dirty && (
          <div className="bg-blue-100 p-2 text-xs rounded my-2 text-blue-800">
            Please note that this playground has
            <strong> unsaved changes </strong>. The link below
            <strong> will not include </strong> your latest changes!
          </div>
        )}

        <label className="text-xs">playground link:</label>
        <div className="flex space-x-4">
          <Input defaultValue={window.location.href} name="url" />
          <CopyButton text={window.location.href} />
        </div>
      </div>
    </div>
  );
}

export default Share;
