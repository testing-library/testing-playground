import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Scrollable from './components/Scrollable';
import setupHighlighter from '../devtools/src/content-script/highlighter';
import cssPath from './lib/cssPath';
import { getQueryAdvise } from './lib';

function postMessage(event, payload) {
  top.postMessage(
    {
      source: 'testing-playground-sandbox',
      event,
      payload,
    },
    top.location.origin,
  );
}

let rootNode;
let highlighter;

function Sandbox() {
  useEffect(() => {
    // let the parent frame know where ready to eval code
    postMessage('SANDBOX_LOADED');
    setTimeout(() => {
      rootNode = document.getElementById('sandbox');

      highlighter = setupHighlighter({
        view: rootNode,
        onSelectNode,
      });
    }, 0);
  }, []);

  return (
    <div
      className="pr-1 relative w-screen h-screen overflow-hidden"
      onMouseEnter={() =>
        highlighter?.start({ stopOnClick: false, blockEvents: false })
      }
      onMouseLeave={() => highlighter?.stop()}
    >
      <Scrollable id="sandbox" />
    </div>
  );
}

function onSelectNode(node, { trigger }) {
  const { suggestion, data } = getQueryAdvise({
    element: node,
    rootNode,
  });

  if (!suggestion?.expression) {
    return;
  }

  const payload = {
    suggestion,
    data,
    cssPath: cssPath(node, true).toString(),
  };

  // toString can't be serialized for postMessage
  delete payload.query?.toString;
  const event = trigger === 'click' ? 'SELECT_NODE' : 'HOVER_NODE';
  postMessage(event, payload);
}

ReactDOM.render(<Sandbox />, document.getElementById('app'));
