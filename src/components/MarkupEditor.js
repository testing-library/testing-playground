import React, { useCallback, useState } from 'react';
import Editor from './Editor';
import debounce from 'lodash.debounce';

function MarkupEditor({ markup, dispatch }) {
  const [initialValue] = useState(markup);

  const onLoad = useCallback(
    (editor) => dispatch({ type: 'SET_MARKUP_EDITOR', editor }),
    [dispatch],
  );

  const onChange = useCallback(
    debounce(
      (markup) => dispatch({ type: 'SET_MARKUP', markup, updateEditor: false }),
      1000,
    ),
    [dispatch],
  );

  return (
    <div className="h-full w-full flex flex-col">
      <div className="markup-editor flex-auto relative overflow-hidden">
        <Editor
          mode="htmlmixed"
          initialValue={initialValue}
          onLoad={onLoad}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default React.memo(MarkupEditor);
