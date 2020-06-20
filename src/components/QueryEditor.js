import React, { useCallback } from 'react';
import Editor from './Editor';
import debounce from 'lodash.debounce';

function QueryEditor({ query, dispatch }) {
  const onLoad = useCallback(
    (editor) => dispatch({ type: 'SET_QUERY_EDITOR', editor }),
    [dispatch],
  );

  const debounceSpeed = 1000;

  const scheduleChange = useCallback(
    debounce((query) => {
      dispatch({ type: 'SET_QUERY', query, updateEditor: false });
    }, debounceSpeed),
    [dispatch, debounceSpeed],
  );

  const onChange = useCallback(
    (query, { origin }) => {
      if (origin === 'user') {
        dispatch({ type: 'SET_QUERY', query, updateEditor: false });
      } else {
        scheduleChange(query);
      }
    },
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
