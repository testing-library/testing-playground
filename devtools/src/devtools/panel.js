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
      setResult({ elements: [data] });
      editor.current.setValue(data.suggestion?.snippet || '');
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
    <div className="bg-white w-screen h-screen flex flex-col">
      <div className="flex-none w-full">
        <MenuBar
          cssPath={result.elements?.[0]?.cssPath}
          suggestion={result.expression}
        />
      </div>
      <div className="grid relative p-2 gap-4 flex-auto grid-cols-1 md:grid-cols-2 grid-equal-cells overflow-hidden">
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
