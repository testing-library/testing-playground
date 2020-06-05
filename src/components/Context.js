import React, { useContext, useReducer, useEffect } from 'react';
import parser from '../parser';
import { initialValues as defaultValues } from '../constants';
export const AppContext = React.createContext();

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
        result: parser.parse({ markup: action.markup, query: state.query }),
      };
    }

    case 'SET_QUERY_EDITOR': {
      return { ...state, queryEditor: action.editor };
    }

    case 'SET_QUERY': {
      if (action.updateEditor !== false) {
        state.queryEditor.setValue(action.query);
      }

      return {
        ...state,
        setQuery: action.query,
        result: parser.parse({ markup: state.markup, query: action.query }),
      };
    }

    default: {
      throw new Error('Unknown action type: ' + action.type);
    }
  }
}

export function PlaygroundProvider(props) {
  let { initialValues: { markup, query } = {} } = props;

  if (!markup && !query) {
    markup = defaultValues.markup;
    query = defaultValues.query;
  }

  const result = parser.parse({ markup, query, cacheId: props.instanceId });
  const [state, dispatch] = useReducer(reducer, { result, markup, query });

  useEffect(() => {
    if (typeof props.onChange === 'function') {
      props.onChange(state);
    }
  }, [state.result]);

  return <AppContext.Provider value={{ state, dispatch }} {...props} />;
}

export function usePlayground() {
  return useContext(AppContext);
}
