import React from 'react';
import Input from './Input';
import CopyButton from './CopyButton';

function Share() {
  return (
    <div className="settings text-sm pb-2">
      <div>
        <h3 className="text-sm font-bold mb-2">Share</h3>
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
