import 'regenerator-runtime/runtime';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Bridge from 'crx-bridge';
import Query from '../../../src/components/Query';
import Result from '../../../src/components/Result';
import MenuBar from './components/MenuBar';

function Panel() {
  const [result, setResult] = useState({});
  const editor = useRef(null);

  useEffect(() => {
    Bridge.onMessage('SELECT_NODE', ({ data }) => {
      setResult(data);
      editor.current.setValue(data.query);
    });
  }, [setResult]);

  const dispatch = useCallback(
    (action) => {
      switch (action.type) {
        case 'SET_QUERY': {
          Bridge.sendMessage(
            'PARSE_QUERY',
            {
              query: action.query,
              highlight: true,
            },
            'content-script',
          ).then(({ result }) => {
            setResult(result);
          });

          if (action.origin !== 'EDITOR') {
            editor.current.setValue(action.query);
          }
          break;
        }

        case 'SET_QUERY_EDITOR': {
          editor.current = action.editor;
        }
      }
    },
    [setResult],
  );

  return (
    <div className="flex h-screen w-screen flex-col bg-white">
      <div className="w-full flex-none">
        <MenuBar
          cssPath={result.elements?.[0]?.cssPath}
          suggestion={result.expression}
        />
      </div>
      <div className="grid-equal-cells relative grid flex-auto grid-cols-1 gap-4 overflow-hidden p-2 md:grid-cols-2">
        <div className="relative">
          <Query
            query={''}
            result={result}
            dispatch={dispatch}
            variant="minimal"
          />
        </div>

        <div className="overflow-hidden">
          <Result result={result} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<Panel />, document.getElementById('app'));
