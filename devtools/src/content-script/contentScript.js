import Bridge from 'crx-bridge';
import setupHighlighter from './highlighter';

import parser from '../../../src/parser';
import { getAllPossibleQueries } from '../../../src/lib';
import inject from './lib/inject';
import { setup } from '../window/testing-library';
import onDocReady from './lib/onDocReady';

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

    const result = parser.parse({
      rootNode: document.body,
      query: suggestion?.snippet || '',
    });

    Bridge.sendMessage('SELECT_NODE', result, 'devtools');
  }

  Bridge.onMessage('PARSE_QUERY', function ({ data }) {
    const result = parser.parse({
      rootNode: document.body,
      query: data.query,
    });

    if (data.highlight) {
      const selector = result.elements.map((x) => x.cssPath).join(', ');
      const nodes =
        result.elements.length > 0
          ? Array.from(document.body.querySelectorAll(selector))
          : [];

      hook.highlighter.highlight({
        nodes,
        hideAfterTimeout: data.hideAfterTimeout ?? 1500,
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
