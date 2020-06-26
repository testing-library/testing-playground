import { useReducer, useEffect } from 'react';
import parser from '../parser';
import { initialValues as defaultValues } from '../constants';
import { withLogging } from '../lib/logger';
import postMessage from '../lib/postMessage';

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MARKUP_EDITOR': {
      return { ...state, markupEditor: action.editor };
    }

    case 'SET_MARKUP': {
      if (action.updateEditor !== false) {
        state.markupEditor.setValue(action.markup);
      }

      postMessage(state.sandbox, action);

      return {
        ...state,
        markup: action.markup,
        result: parser.parse({
          markup: action.markup,
          query: state.query,
          rootNode: state.rootNode,
          prevResult: state.result,
        }),
      };
    }

    case 'SET_QUERY_EDITOR': {
      return { ...state, queryEditor: action.editor };
    }

    case 'SET_SANDBOX_FRAME': {
      postMessage(action.sandbox, {
        type: 'POPULATE_SANDBOX',
        markup: state.markup,
        query: state.query,
      });

      return { ...state, sandbox: action.sandbox };
    }

    case 'SET_QUERY': {
      if (action.updateEditor !== false && state.queryEditor) {
        state.queryEditor.setValue(action.query);
      }

      postMessage(state.sandbox, action);

      return {
        ...state,
        query: action.query,
        result: parser.parse({
          markup: state.markup,
          query: action.query,
          rootNode: state.rootNode,
          prevResult: state.result,
        }),
      };
    }

    default: {
      throw new Error('Unknown action type: ' + action.type);
    }
  }
}

function init(initialState) {
  return {
    ...initialState,
    result: parser.parse(initialState),
  };
}

function usePlayground(props) {
  let { markup, query, onChange, instanceId, rootNode } = props || {};

  if (!markup && !query) {
    markup = defaultValues.markup;
    query = defaultValues.query;
  }

  const [state, dispatch] = useReducer(
    withLogging(reducer),
    {
      rootNode,
      markup,
      query,
      cacheId: instanceId,
    },
    init,
  );

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(state);
    }
  }, [state.result]);

  return [state, dispatch];
}

export default usePlayground;
