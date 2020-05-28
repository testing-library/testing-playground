import React from 'react';
import Editor from './Editor';
import { useAppContext } from './Context';

function QueryEditor({ initialValue, onChange }) {
  const { jsEditorRef } = useAppContext();

  return (
    <Editor
      mode="javascript"
      initialValue={initialValue}
      onChange={onChange}
      ref={jsEditorRef}
    />
  );
}

export default QueryEditor;
