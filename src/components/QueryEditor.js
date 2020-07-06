import React, { useCallback } from 'react';
import Editor from './Editor';

function QueryEditor(props) {
  const { dispatch, initialValue } = props;

  const onLoad = useCallback(
    (editor) => dispatch({ type: 'SET_QUERY_EDITOR', editor }),
    [dispatch],
  );

  const onChange = useCallback(
    (query, { origin }) =>
      dispatch({
        type: 'SET_QUERY',
        query,
        updateEditor: false,
        immediate: origin === 'user',
      }),
    [dispatch],
  );

  return (
    <div className="flex flex-col w-full h-full">
      <Editor
        mode="javascript"
        initialValue={initialValue}
        onLoad={onLoad}
        onChange={onChange}
      />
    </div>
  );
}

export default React.memo(QueryEditor);
