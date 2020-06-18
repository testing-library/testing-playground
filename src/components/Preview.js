import React, { useState, useEffect, useRef, useCallback } from 'react';
import PreviewHint from './PreviewHint';
import AddHtml from './AddHtml';
import { getRoles } from '@testing-library/dom';
import debounce from 'lodash.debounce';

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

function setInnerHTML(node, html) {
  const doc = node.ownerDocument;
  node.innerHTML = html;

  for (let prevScript of node.querySelectorAll('script')) {
    const newScript = doc.createElement('script');

    for (let [key, value] of prevScript.attributes) {
      newScript[key] = value;
    }

    newScript.appendChild(doc.createTextNode(prevScript.innerHTML));
    prevScript.parentNode.replaceChild(newScript, prevScript);
  }
}

function Preview({ markup, variant, forwardedRef, dispatch }) {
  const [roles, setRoles] = useState([]);
  const [suggestion, setSuggestion] = useState();

  const frameRef = useRef();

  const refSetter = useCallback((node) => {
    frameRef.current = node;
  }, []);

  useEffect(() => {
    const listener = ({ data: { source, event, payload } = {} }) => {
      if (source !== 'testing-playground-sandbox') {
        return;
      }

      switch (event) {
        case 'SANDBOX_LOADED': {
          const { root } = getSandbox(frameRef);

          setInnerHTML(root, markup);
          setRoles(Object.keys(getRoles(root) || {}).sort());

          if (typeof forwardedRef === 'function') {
            forwardedRef(root);
          }

          break;
        }

        case 'SELECT_NODE': {
          dispatch({ type: 'SET_QUERY', query: payload.suggestion.expression });
          break;
        }

        case 'HOVER_NODE': {
          setSuggestion(payload.suggestion);
          break;
        }
      }
    };

    window.addEventListener('message', listener, false);
    return () => window.removeEventListener('message', listener);
  }, [markup]);

  const reload = useCallback(
    debounce(() => {
      const { document } = getSandbox(frameRef);

      if (document) {
        // When the user is using inline scripts, we need to clean the context before
        // re-evaluation of the scripts. Otherwise he could get errors like
        //   `Identifier 'button' has already been declared`
        document.location.reload(true);
      } else {
        // markup might have changed, while the iframe navigated to a different origin
        // restore the origin, and use a cache breaker to make the iframe trigger a reload
        frameRef.current.setAttribute('src', '/sandbox.html?' + Date.now());
      }
    }, 500),
    [frameRef],
  );

  useEffect(reload, [markup]);

  return markup ? (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      <div className="flex-auto relative overflow-hidden">
        <iframe
          ref={refSetter}
          src="/sandbox.html"
          security="restricted"
          className="w-full h-full"
          scrolling="no"
          frameBorder="0"
        />
      </div>

      {variant !== 'minimal' && (
        <PreviewHint roles={roles} suggestion={suggestion} />
      )}
    </div>
  ) : (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      <AddHtml />
    </div>
  );
}

export default React.memo(Preview);
