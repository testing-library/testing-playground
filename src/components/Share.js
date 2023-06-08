import React, { useEffect } from 'react';
import Input from './Input';
import CopyButton from './CopyButton';
import { SyncIcon } from '@primer/octicons-react';

function Share({ dirty, dispatch, gistId, gistVersion }) {
  useEffect(() => {
    if (!dirty) {
      return;
    }

    dispatch({ type: 'SAVE' });
  }, [dirty, gistId, dispatch]);

  // it is possible to have a clean state, and still no gistId. This happens
  // on either empty playgrounds, or when using statefull urls.
  const shareUrl = gistId
    ? [location.origin, 'gist', gistId, gistVersion].filter(Boolean).join('/')
    : location.href;

  return (
    <div className="settings pb-2 text-sm">
      <div>
        <h3 className="mb-2 text-sm font-bold">Share</h3>

        <label className="text-xs">playground link:</label>
        {dirty ? (
          <div className="border rounded flex w-full items-center space-x-4 bg-white px-3 py-2 leading-tight text-gray-800">
            <SyncIcon size={12} className="spinner" />
            <span>one sec...</span>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Input key={shareUrl} defaultValue={shareUrl} readOnly name="url" />
            <CopyButton text={shareUrl} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Share;
