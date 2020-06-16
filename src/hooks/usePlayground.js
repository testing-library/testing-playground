import { useReducer, useEffect } from 'react';
import parser from '../parser';
import { initialValues as defaultValues } from '../constants';
import { withLogging } from '../lib/logger';

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MARKUP_EDITOR': {
      return { ...state, markupEditor: action.editor };
    }

    case 'SET_MARKUP': {
      if (action.updateEditor !== false) {
        state.markupEditor.setValue(action.markup);
      }

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

    case 'SET_QUERY': {
      if (action.updateEditor !== false && state.queryEditor) {
        state.queryEditor.setValue(action.query);
      }

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

    case 'TOGGLE_EXECUTION': {
      return { ...state, eventExecuted: !state.eventExecuted };
    }

    default: {
      throw new Error('Unknown action type: ' + action.type);
    }
  }
}

function usePlayground(props) {
  let { markup, query, onChange, instanceId, rootNode } = props || {};

  if (!markup && !query) {
    markup = defaultValues.markup;
    query = defaultValues.query;
  }

  const result = parser.parse({ rootNode, markup, query, cacheId: instanceId });
  const [state, dispatch] = useReducer(withLogging(reducer), {
    rootNode,
    markup,
    eventExecuted: result ? result.markup !== markup : false,
    query,
    result,
  });

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(state);
    }
  }, [state.result]);
  return [state, dispatch];
}

export default usePlayground;
