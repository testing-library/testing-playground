import { useEffect } from 'react';
import parser from '../parser';
import { initialValues as defaultValues } from '../constants';
import { withLogging } from '../lib/logger';
import postMessage from '../lib/postMessage';
import debounce from 'lodash.debounce';
import { useEffectReducer } from 'use-effect-reducer';

function reducer(state, action, exec) {
  const immediate = action.immediate;

  switch (action.type) {
    case 'RESET': {
      exec({ type: 'UPDATE_SANDBOX', immediate: true });
      exec({ type: 'UPDATE_EDITOR', editor: '*' });

      return {
        ...state,
        markup: defaultValues.markup,
        query: defaultValues.query,
        result: parser.parse({
          markup: defaultValues.markup,
          query: defaultValues.query,
          rootNode: state.rootNode,
          prevResult: state.result,
        }),
      };
    }

    case 'SET_MARKUP_EDITOR': {
      return { ...state, markupEditor: action.editor };
    }

    case 'SET_QUERY_EDITOR': {
      return { ...state, queryEditor: action.editor };
    }

    case 'SET_SANDBOX_FRAME': {
      exec({ type: 'APPLY_SETTINGS' });
      exec({ type: 'UPDATE_SANDBOX', immediate: true });
      return { ...state, sandbox: action.sandbox };
    }

    case 'SET_MARKUP': {
      if (action.updateEditor !== false) {
        exec({ type: 'UPDATE_EDITOR', editor: 'markup' });
      }

      exec({ type: 'UPDATE_SANDBOX', immediate });

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

    case 'SET_QUERY': {
      if (action.updateEditor !== false) {
        exec({ type: 'UPDATE_EDITOR', editor: 'query' });
      }

      exec({ type: 'UPDATE_SANDBOX', immediate });

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

    case 'SET_STATUS': {
      return {
        ...state,
        status: action.status || 'idle',
      };
    }

    case 'EVALUATE': {
      exec({ type: 'UPDATE_SANDBOX', immediate });
      return state;
    }

    case 'SET_SETTINGS': {
      // eslint-disable-next-line no-unused-vars
      const { type, ...settings } = action;
      exec({ type: 'APPLY_SETTINGS' });

      const nextSettings = {
        ...state.settings,
        ...settings,
      };

      exec({ type: 'SAVE_SETTINGS' });

      return {
        ...state,
        settings: nextSettings,
      };
    }

    default: {
      throw new Error('Unknown action type: ' + action.type);
    }
  }
}

function init(props) {
  const localSettings = JSON.parse(localStorage.getItem('playground_settings'));

  let { markup, query, instanceId } = props;

  if (!markup && !query) {
    markup = defaultValues.markup;
    query = defaultValues.query;
  }

  const state = {
    ...props,
    markup,
    query,
    cacheId: instanceId,
    settings: Object.assign(
      {
        autoRun: true,
        testIdAttribute: 'data-testid',
      },
      localSettings,
    ),
  };

  parser.configure(state.settings);

  return {
    ...state,
    result: parser.parse(state),
  };
}

const populateSandbox = (state, effect, dispatch) => {
  dispatch({ type: 'SET_STATUS', status: 'evaluating' });

  postMessage(state.sandbox, {
    type: 'UPDATE_SANDBOX',
    markup: state.markup,
    query: state.settings.autoRun ? state.query : '',
  });
};

const configureSandbox = (state) => {
  postMessage(state.sandbox, {
    type: 'CONFIGURE_SANDBOX',
    settings: state.settings,
  });
};

const populateSandboxDebounced = debounce(populateSandbox, 250);

const effectMap = {
  UPDATE_SANDBOX: (state, effect, dispatch) => {
    if (state.settings.autoRun) {
      populateSandboxDebounced(state, effect, dispatch);
    } else if (effect.immediate) {
      populateSandbox(state, effect, dispatch);
    }
  },

  UPDATE_EDITOR: (state, effect) => {
    switch (effect.editor) {
      case 'markup': {
        state.markupEditor?.setValue(state.markup);
        break;
      }

      case 'query': {
        state.queryEditor?.setValue(state.query);
        break;
      }

      case '*': {
        state.markupEditor?.setValue(state.markup);
        state.queryEditor?.setValue(state.query);
        break;
      }

      default: {
        throw new Error('unknown editor');
      }
    }
  },

  SAVE_SETTINGS: (state) => {
    localStorage.setItem('playground_settings', JSON.stringify(state.settings));
  },

  APPLY_SETTINGS: (state, effect, dispatch) => {
    parser.configure(state.settings);
    configureSandbox(state, effect, dispatch);
    populateSandboxDebounced(state, effect, dispatch);
  },
};

function usePlayground(props) {
  const { onChange } = props || {};

  const [state, dispatch] = useEffectReducer(
    withLogging(reducer),
    () => init(props),
    effectMap,
  );

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(state);
    }
  }, [state.result, onChange]);

  useEffect(() => {
    const listener = ({ data: { source, type } }) => {
      if (source !== 'testing-playground-sandbox') {
        return;
      }

      if (type === 'SANDBOX_READY') {
        dispatch({ type: 'SET_STATUS', status: 'idle' });
      } else if (type === 'SANDBOX_BUSY') {
        dispatch({ type: 'SET_STATUS', status: 'evaluating' });
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [state.sandbox]);

  return [state, dispatch];
}

export default usePlayground;
