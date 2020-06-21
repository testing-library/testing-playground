import React, { useCallback, useState, useEffect, useRef } from 'react';
import Editor from './Editor';
import debounce from 'lodash.debounce';
import Spinner from './Spinner';
import { SyncIcon } from '@primer/octicons-react';

function useSandboxBusy() {
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const listener = ({ data: { source, type } }) => {
      if (source !== 'testing-playground-sandbox') {
        return;
      }

      if (type === 'SANDBOX_READY') {
        setBusy(false);
      } else if (type === 'SANDBOX_BUSY') {
        setBusy(true);
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [setBusy]);

  return [busy, setBusy];
}

function QueryEditor(props) {
  const { dispatch, initialValue } = props;
  const queryRef = useRef(initialValue);

  const [state, setState] = useState('active');
  const [running, setRunning] = useSandboxBusy();

  const onLoad = useCallback(
    (editor) => dispatch({ type: 'SET_QUERY_EDITOR', editor }),
    [dispatch],
  );

  const dispatchQuery = useCallback(
    (query) => {
      // I don't like this, but the BUSY > READY post messages are coming in
      // at the same time. We're waiting for BUSY, instead of READY
      setRunning(true);
      dispatch({ type: 'SET_QUERY', query, updateEditor: false });
    },
    [dispatch],
  );

  // should we make this dynamic? 1000 ms by default, 3000 ms when detected userEvent ?
  const scheduleQueryDispatch = useCallback(debounce(dispatchQuery, 1000), [
    dispatchQuery,
  ]);

  const onChange = useCallback(
    (query, { origin }) => {
      queryRef.current = query;

      if (origin === 'user') {
        scheduleQueryDispatch.cancel();
        dispatchQuery(query);
      } else if (state === 'active') {
        scheduleQueryDispatch(query);
      }
    },
    [dispatchQuery, scheduleQueryDispatch, state],
  );

  return (
    <div className="flex flex-col w-full h-full">
      <div className="-mt-2 mb-1 flex-none space-x-4 text-gray-800 font-mono text-xs font-bold flex justify-between items-center">
        <button
          className="opacity-75 hover:opacity-100"
          onClick={running ? undefined : () => dispatchQuery(queryRef.current)}
          title="evaluate code (hotkey: ctrl + enter || cmd + enter)"
        >
          {running ? <Spinner /> : 'run'}
        </button>

        <button
          className="opacity-75 hover:opacity-100"
          title={`click to ${
            state === 'active' ? 'disable' : 'enable'
          } automatic code evaluation`}
          onClick={() => {
            if (state === 'active') {
              setState('paused');
              dispatchQuery('');
            } else {
              setState('active');
              dispatchQuery(queryRef.current);
            }
          }}
        >
          <SyncIcon size={12} />
          <span>{state === 'active' ? 'enabled' : 'disabled'}</span>
        </button>
      </div>
      <div className="flex-auto overflow-hidden relative">
        <Editor
          mode="javascript"
          initialValue={initialValue}
          onLoad={onLoad}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default React.memo(QueryEditor);
