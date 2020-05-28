import React from 'react';
import Editor from './Editor';

function MarkupEditor({ initialValue, onChange }) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="markup-editor flex-auto relative overflow-hidden">
        <Editor mode="html" initialValue={initialValue} onChange={onChange} />
      </div>
    </div>
  );
}

export default MarkupEditor;
