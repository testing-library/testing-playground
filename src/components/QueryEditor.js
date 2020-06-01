import React from 'react';
import Editor from './Editor';
import { usePlayground } from './Context';

function QueryEditor() {
  const { dispatch, state } = usePlayground();

  const onLoad = (editor) => dispatch({ type: 'SET_QUERY_EDITOR', editor });

  const onChange = (query) =>
    dispatch({ type: 'SET_QUERY', query, updateEditor: false });

  return (
    <Editor
      mode="javascript"
      initialValue={state.query}
      onLoad={onLoad}
      onChange={onChange}
    />
  );
}

export default QueryEditor;
