import React, { useState, useEffect, useRef, useCallback } from 'react';
import PreviewHint from './PreviewHint';
import EmptyPane from './EmptyPane';
import { getRoles } from '@testing-library/dom';

function getSandbox(ref) {
  try {
    const document =
      ref.current?.contentDocument ||
      ref.current?.contentWindow?.document ||
      null;

    if (document) {
      document.__SANDBOX_ROOT__ =
        document.__SANDBOX_ROOT__ || document.getElementById('sandbox');

      return {
        document: document,
        root: document.__SANDBOX_ROOT__,
      };
    }
  } catch (e) {
    console.log(
      'iframe navigated away from this origin, we no longer have access to the document',
    );
  }

  return { document: null, root: null };
}

function Preview({ markup, variant, forwardedRef, dispatch }) {
  const [roles, setRoles] = useState([]);
  const [suggestion, setSuggestion] = useState();

  const frameRef = useRef();

  const refSetter = useCallback((node) => {
    frameRef.current = node;
  }, []);

  const handleLoadIframe = useCallback(() => {
    dispatch({
      type: 'SET_SANDBOX_FRAME',
      sandbox: frameRef.current.contentWindow,
    });
  }, [dispatch]);

  useEffect(() => {
    const listener = ({ data: { source, type, suggestion } = {} }) => {
      if (source !== 'testing-playground-sandbox') {
        return;
      }

      switch (type) {
        case 'SANDBOX_LOADED': {
          const { root } = getSandbox(frameRef);

          //setInnerHTML(root, markup);
          setRoles(Object.keys(getRoles(root) || {}).sort());

          if (typeof forwardedRef === 'function') {
            forwardedRef(root);
          }

          break;
        }

        case 'SELECT_NODE': {
          dispatch({ type: 'SET_QUERY', query: suggestion.snippet });
          break;
        }

        case 'HOVER_NODE': {
          setSuggestion(suggestion);
          break;
        }
      }
    };

    window.addEventListener('message', listener, false);
    return () => window.removeEventListener('message', listener);
  }, [dispatch, forwardedRef, markup]);

  return (
    <div className="w-full h-full flex flex-col relative">
      <iframe
        ref={refSetter}
        src="/sandbox.html"
        security="restricted"
        className="flex-auto"
        scrolling="no"
        frameBorder="0"
        onLoad={handleLoadIframe}
      />

      {markup && variant !== 'minimal' && (
        <PreviewHint roles={roles} suggestion={suggestion} />
      )}

      {!markup && (
        <div className="absolute w-full h-full top-0 left-0">
          <EmptyPane />
        </div>
      )}
    </div>
  );
}

export default React.memo(Preview);
