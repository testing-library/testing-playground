import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useEffectReducer } from 'use-effect-reducer';
import memoize from 'memoize-one';
import parser from '../parser';
import { initialValues as defaultValues } from '../constants';
import { withLogging } from '../lib/logger';
import postMessage from '../lib/postMessage';
import gist from '../api/gist';
import url from '../lib/state/url';

let history;

// Note: don't place heavy tasks in the reducer, add them to the effects!
// the reducer is run twice (by react design), while the effect is only run once
function reducer(state, action, exec) {
  const immediate = action.immediate;

  switch (action.type) {
    // I don't really like the way this RESET method works, but a hard refresh
    // sucks in UX, and I haven't had the time yet to figure out a way to reset
    // the full state without providing new values. I was thinking about using a
    // {key] on <Playground> that is either the {gistId}-{gistVersion} or a
    // {Date.now()}. Is that really the best way?
    case 'RESET': {
      exec({ type: 'UPDATE_SANDBOX', immediate: true });
      exec({ type: 'UPDATE_EDITOR', editor: '*' });
      exec({ type: 'REDIRECT', path: '/' });

      return {
        ...state,
        gistId: undefined,
        gistVersion: undefined,
        markup: defaultValues.markup,
        query: defaultValues.query,
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
      if (action.origin !== 'EDITOR') {
        exec({ type: 'UPDATE_EDITOR', editor: 'markup' });
      }

      exec({ type: 'UPDATE_SANDBOX', immediate });

      return {
        ...state,
        dirty: true,
        markup: action.markup,
      };
    }

    case 'SET_QUERY': {
      if (action.origin !== 'EDITOR') {
        exec({ type: 'UPDATE_EDITOR', editor: 'query' });
      }

      if (action.origin !== 'SANDBOX') {
        exec({ type: 'UPDATE_SANDBOX', immediate });
      }

      return {
        ...state,
        dirty: true,
        query: action.query,
      };
    }

    case 'SET_STATUS': {
      return {
        ...state,
        status: action.status || 'idle',
      };
    }

    case 'SET_RESULT': {
      return {
        ...state,
        result: action.result,
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

    case 'SAVE': {
      exec({ type: 'SAVE' });

      return {
        ...state,
        dirty: false,
        status: 'saving',
      };
    }

    case 'FORK': {
      exec({ type: 'FORK' });

      return {
        ...state,
        dirty: false,
        status: 'saving',
      };
    }

    default: {
      throw new Error('Unknown action type: ' + action.type);
    }
  }
}

const populateSandbox = (state, effect, dispatch) => {
  dispatch({ type: 'SET_STATUS', status: 'evaluating' });

  postMessage(state.sandbox, {
    type: 'UPDATE_SANDBOX',
    markup: state.markup,
    query: state.settings.autoRun || effect.immediate ? state.query : '',
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
    // sometimes this happens. race-condition? I'm not sure.
    if (!state.markup && !state.rootNode) {
      return;
    }

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

  LOAD: async (state, effect, dispatch) => {
    const { settings, markup, query } = await gist.fetch({
      id: state.gistId,
      version: state.gistVersion,
    });

    dispatch({ type: 'SET_SETTINGS', ...settings });
    dispatch({ type: 'SET_MARKUP', markup });
    dispatch({ type: 'SET_QUERY', query });
  },

  SAVE: async (state, effect, dispatch) => {
    const { id, version } = await gist.save({
      id: state.gistId,
      markup: state.markup,
      query: state.query,
      settings: state.settings,
    });

    history.push(`/gist/${id}/${version}`);
    dispatch({ type: 'SET_STATUS', status: 'idle' });
  },

  FORK: async (state, effect, dispatch) => {
    // note that we don't use the fork api, as that one wouldn't take the current
    // local changes into account. Fork would fork the source gist as is, while
    // just creating a new gist, uses the local state.
    const { id, version } = await gist.save({
      markup: state.markup,
      query: state.query,
      settings: state.settings,
    });

    history.push(`/gist/${id}/${version}`);
    dispatch({ type: 'SET_STATUS', status: 'idle' });
  },

  REDIRECT: (state, effect) => {
    history.push(effect.path);
  },
};

function getInitialState(props) {
  const localSettings = JSON.parse(localStorage.getItem('playground_settings'));

  const state = {
    ...props,
    status: 'loading',
    dirty: false,
    settings: Object.assign(
      {
        autoRun: true,
        testIdAttribute: 'data-testid',
      },
      localSettings,
    ),
  };

  parser.configure(state.settings);

  return (exec) => {
    if (props.gistId) {
      exec({ type: 'LOAD' });
      return state;
    }
    // try get state from url (legacy fallback)
    else {
      const params = url.load();
      if (params.markup && params.query) {
        return {
          ...state,
          ...params,
          dirty: true,
        };
      }
    }

    return {
      ...state,
      ...defaultValues,
    };
  };
}

const getInitialStateMemoized = memoize(getInitialState);

function usePlayground(props) {
  const { onChange } = props || {};

  // lift it to the file scope, so that effects can access it
  history = useHistory();

  const [state, dispatch] = useEffectReducer(
    withLogging(reducer),
    getInitialStateMemoized(props),
    effectMap,
  );

  // call onChange handler when result changes
  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(state);
    }
    // ignore the exhaustive deps. We really want to call onChange with the full
    // state object, but only when `state.result` has changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.result, onChange]);

  // propagate sandbox ready/busy events to playground state
  useEffect(() => {
    const listener = ({ data: { source, type, result } }) => {
      if (source !== 'testing-playground-sandbox') {
        return;
      }

      if (type === 'SANDBOX_READY') {
        dispatch({ type: 'SET_STATUS', status: 'idle' });
        dispatch({ type: 'SET_RESULT', result });
      } else if (type === 'SANDBOX_BUSY') {
        dispatch({ type: 'SET_STATUS', status: 'evaluating' });
      }
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [state.sandbox, dispatch]);

  return [state, dispatch];
}

export default usePlayground;
