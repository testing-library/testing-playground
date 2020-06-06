import React, { useCallback } from 'react';
import Editor from './Editor';

function QueryEditor({ query, dispatch }) {
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
      initialValue={query}
      onLoad={onLoad}
      onChange={onChange}
    />
  );
}

export default React.memo(QueryEditor);
