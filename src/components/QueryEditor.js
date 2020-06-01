import React, { useCallback } from 'react';
import Editor from './Editor';
import { usePlayground } from './Context';

function QueryEditor() {
  const { dispatch, state } = usePlayground();

  const onLoad = useCallback(
    (editor) => dispatch({ type: 'SET_QUERY_EDITOR', editor }),
    [dispatch],
  );

  const onChange = useCallback(
    (query) => dispatch({ type: 'SET_QUERY', query, updateEditor: false }),
    [dispatch],
  );

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
