import { useEffect, useReducer } from 'react';

import { initialValues as defaultValues } from '../constants';
import { withLogging } from '../lib/logger';
import globalState from '../lib/state';
import parser from '../parser';

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MARKUP_EDITOR': {
      return {
        ...state,
        markupEditor: action.editor,
      };
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
          prevResult: state.result,
        }),
      };
    }

    case 'SET_QUERY_EDITOR': {
      return {
        ...state,
        queryEditor: action.editor,
      };
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
          prevResult: state.result,
        }),
      };
    }

    default: {
      throw new Error('Unknown action type: ' + action.type);
    }
  }
}

const onStateChange = ({ markup, query, result }) => {
  globalState.save({ markup, query });
  globalState.updateTitle(result?.expression?.expression);
};

const usePlayground = ({ instanceId }) => {
  let { markup, query } = globalState.load();

  if (!markup && !query) {
    markup = defaultValues.markup;
    query = defaultValues.query;
  }

  const result = parser.parse({ markup, query, cacheId: instanceId });
  const [state, dispatch] = useReducer(withLogging(reducer), {
    markup,
    markupEditor: null,
    query,
    result,
  });

  useEffect(() => {
    onStateChange(state);
  }, [state.result]);

  return [state, dispatch];
};

export default usePlayground;
