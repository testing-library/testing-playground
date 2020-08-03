import 'regenerator-runtime/runtime';
import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';
import Scrollable from './components/Scrollable';
import setupHighlighter from '../devtools/src/content-script/highlighter';
import cssPath from './lib/cssPath';
import { getAllPossibleQueries } from './lib';
import parser from './parser';

const state = {
  queriedNodes: [],
  markup: '',
  query: '',
  rootNode: null,
  highlighter: null,
  settings: {
    testIdAttribute: 'data-testid',
  },
};

function postMessage(action) {
  parent.postMessage(
    {
      source: 'testing-playground-sandbox',
      ...action,
    },
    parent.location.origin,
  );
}

function runQuery(rootNode, query) {
  const result = parser.parse({ rootNode, query });
  const selector = result.elements.map((x) => x.cssPath).join(', ');
  state.queriedNodes =
    result.elements.length > 0
      ? Array.from(rootNode.querySelectorAll(selector))
      : [];
  state.highlighter.highlight({ nodes: state.queriedNodes });
  return result;
}

function setInnerHTML(node, html) {
  const doc = node.ownerDocument;
  node.innerHTML = html;

  for (let prevScript of node.querySelectorAll('script')) {
    const newScript = doc.createElement('script');

    for (let attribute of prevScript.attributes) {
      newScript[attribute.name] = attribute.value;
    }

    newScript.type = prevScript.type || 'text/javascript';

    const text =
      newScript.type === 'text/javascript'
        ? `(function() { ${prevScript.innerHTML} })()`
        : prevScript.innerHTML;

    newScript.appendChild(doc.createTextNode(text));
    prevScript.parentNode.replaceChild(newScript, prevScript);
  }

  for (let anchor of node.querySelectorAll('a')) {
    anchor.addEventListener('click', (e) => {
      if (!e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
      }
    });
  }
}

function Sandbox() {
  const setRootNode = useCallback((node) => {
    if (!node) {
      return;
    }

    state.rootNode = node;

    state.highlighter = setupHighlighter({
      view: state.rootNode,
      onSelectNode,
    });

    // let the parent frame know where ready to eval code
    postMessage({ type: 'SANDBOX_LOADED' });
  }, []);

  return (
    <div
      className="pr-1 relative w-screen h-screen overflow-hidden"
      onMouseEnter={() => {
        state.highlighter?.clear();
        state.highlighter?.start({ stopOnClick: false, blockEvents: false });
      }}
      onMouseLeave={() => {
        state.highlighter?.stop();
        state.highlighter.highlight({ nodes: state.queriedNodes });
      }}
    >
      <Scrollable forwardedRef={setRootNode} id="sandbox" />
    </div>
  );
}

function onSelectNode(node, { origin }) {
  if (!origin || origin === 'script') {
    return;
  }

  const queries = getAllPossibleQueries({
    element: node,
    rootNode: state.rootNode,
  });

  const suggestion = Object.values(queries).find(Boolean);
  if (!suggestion) {
    return;
  }

  const action = {
    type: origin === 'click' ? 'SELECT_NODE' : 'HOVER_NODE',
    suggestion,
    cssPath: cssPath(node, true).toString(),
  };

  if (action.type === 'SELECT_NODE') {
    // optimistically update the highlighted node
    state.queriedNodes = [node];
    state.highlighter.highlight({ nodes: state.queriedNodes });
  }

  postMessage(action);
}

function updateSandbox(rootNode, markup, query) {
  postMessage({ type: 'SANDBOX_BUSY' });
  setInnerHTML(rootNode, markup);

  // get and clean result
  // eslint-disable-next-line no-unused-vars
  const { markup: m, query: q, ...data } = runQuery(rootNode, query);

  const result = {
    ...data,
    accessibleRoles: Object.keys(data.accessibleRoles).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}),
  };

  postMessage({ type: 'SANDBOX_READY', result });
}

function onMessage({ source, data }) {
  if (source !== parent || data.source !== 'testing-playground') {
    return;
  }

  switch (data.type) {
    case 'UPDATE_SANDBOX': {
      state.query = data.query;
      state.markup = data.markup;
      break;
    }

    case 'CONFIGURE_SANDBOX': {
      state.settings = { ...state.settings, ...data.settings };
      parser.configure(state.settings);
      break;
    }
  }

  updateSandbox(state.rootNode, state.markup, state.query);
}

window.addEventListener('message', onMessage, false);

ReactDOM.render(<Sandbox />, document.getElementById('app'));
