import Bridge from 'crx-bridge';
import setupHighlighter from './highlighter';

import parser from '../../../src/parser';
import { getAllPossibleQueries } from '../../../src/lib';
import inject from './lib/inject';
import { setup } from '../window/testing-library';
import onDocReady from './lib/onDocReady';
import cssPath from '../../../src/lib/cssPath';

function init() {
  inject('../window/testing-library.js');
  setup(window);

  window.__TESTING_PLAYGROUND__ = window.__TESTING_PLAYGROUND__ || {};
  const hook = window.__TESTING_PLAYGROUND__;

  hook.highlighter = setupHighlighter({ view: window, onSelectNode });

  function onSelectNode(node) {
    const queries = getAllPossibleQueries({
      rootNode: document.body,
      element: node,
    });

    const suggestion = Object.values(queries).find(Boolean);

    Bridge.sendMessage(
      'SELECT_NODE',
      {
        suggestion,
        queries,
        cssPath: cssPath(node, true).toString(),
      },
      'devtools',
    );
  }

  Bridge.onMessage('PARSE_QUERY', function ({ data }) {
    const result = parser.parse({
      rootNode: document.body,
      query: data.query,
    });

    if (data.highlight) {
      hook.highlighter.highlight({
        nodes: (result.elements || []).map((x) => x.target),
        hideAfterTimeout: data.hideAfterTimeout,
      });
    }

    return { result };
  });

  Bridge.onMessage('SET_SETTINGS', function ({ data }) {
    parser.configure(data);
  });

  // when the selected element is changed by using the element inspector,
  // this method will be called from devtools/main.js
  hook.onSelectionChanged = function onSelectionChanged(el) {
    onSelectNode(el);
  };
}

onDocReady(init);
