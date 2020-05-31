import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Embedded from './components/Embedded.js';
import { PlaygroundProvider } from './components/Context';
import '../src/styles/app.pcss';

async function initPlaygrounds() {
  const root = document.createElement('div');
  root.setAttribute('id', `testing-playground-${Date.now()}`);
  document.body.appendChild(root);

  ReactDOM.render(
    <div
      style={{
        position: 'fixed',
        bottom: 12,
        left: 12,
        right: 12,
        height: 300,
      }}
    >
      <PlaygroundProvider htmlRoot={document.body}>
        <Router>
          <Embedded
            mode="devtool"
            panes={['query', 'result']}
            initialValues={{ markup: '<div />', query: '// foo' }}
          />
        </Router>
      </PlaygroundProvider>
    </div>,
    root,
  );
}

function onDocReady(fn) {
  if (document.readyState !== 'loading') {
    return fn();
  }

  setTimeout(() => {
    onDocReady(fn);
  }, 9);
}

onDocReady(initPlaygrounds);
