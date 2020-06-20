/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * Copyright (c) 2020, Stephan Meijer
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 **/
import Bridge from 'crx-bridge';

import memoize from 'memoize-one';
import throttle from 'lodash.throttle';

import { hideOverlay, showOverlay } from './Highlighter';

// This plug-in provides in-page highlighting of the selected element.
// It is used by the browser extension and the standalone DevTools shell (when connected to a browser).
let iframesListeningTo = new Set();

function withMessageData(fn) {
  return ({ data }) => fn(data);
}

export default function setupHighlighter({
  view = window,
  onSelectNode = () => {},
} = {}) {
  let isInspecting = false;
  let stopOnClick = true;
  let blockEvents = true;

  Bridge.onMessage('CLEAR_HIGHLIGHTS', withMessageData(clearHighlights));
  Bridge.onMessage('HIGHLIGHT_ELEMENTS', withMessageData(highlightElements));
  Bridge.onMessage('SHUTDOWN', withMessageData(stopInspecting));
  Bridge.onMessage('START_INSPECTING', withMessageData(startInspecting));
  Bridge.onMessage('STOP_INSPECTING', withMessageData(stopInspecting));

  function startInspecting(options) {
    isInspecting = true;
    stopOnClick = options.stopOnClick !== false;
    blockEvents = options.blockEvents !== false;

    addEventListeners(view);
  }

  function addEventListeners(view) {
    // This plug-in may run in non-DOM environments (e.g. React Native).
    if (view && typeof view.addEventListener === 'function') {
      view.addEventListener('click', onClick, true);
      view.addEventListener('mousedown', onMouseEvent, true);
      view.addEventListener('mouseover', onMouseEvent, true);
      view.addEventListener('mouseup', onMouseEvent, true);
      view.addEventListener('pointerdown', onPointerDown, true);
      view.addEventListener('pointerover', onPointerOver, true);
      view.addEventListener('pointerup', onPointerUp, true);
    }
  }

  function stopPropagation(event) {
    if (blockEvents) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function stopInspecting() {
    hideOverlay();
    removeEventListeners(view);
    iframesListeningTo.forEach(function (frame) {
      try {
        removeEventListeners(frame.contentWindow);
      } catch (error) {
        // This can error when the iframe is on a cross-origin.
      }
    });
    iframesListeningTo = new Set();
    isInspecting = false;
  }

  function removeEventListeners(view) {
    // This plug-in may run in non-DOM environments (e.g. React Native).
    if (view && typeof view.removeEventListener === 'function') {
      view.removeEventListener('click', onClick, true);
      view.removeEventListener('mousedown', onMouseEvent, true);
      view.removeEventListener('mouseover', onMouseEvent, true);
      view.removeEventListener('mouseup', onMouseEvent, true);
      view.removeEventListener('pointerdown', onPointerDown, true);
      view.removeEventListener('pointerover', onPointerOver, true);
      view.removeEventListener('pointerup', onPointerUp, true);
    }
  }

  function clearHighlights() {
    hideOverlay();
  }

  function highlightElements({ nodes, hideAfterTimeout }) {
    if (isInspecting) {
      return;
    }

    if (nodes?.[0]) {
      const elems = nodes
        .map((x) => (typeof x === 'string' ? document.querySelector(x) : x))
        .filter((x) => x.nodeType === Node.ELEMENT_NODE);

      showOverlay(elems, hideAfterTimeout);
    } else {
      hideOverlay();
    }
  }

  function onClick(event) {
    stopPropagation(event);

    if (isInspecting && stopOnClick) {
      stopInspecting();
    }
  }

  function onMouseEvent(event) {
    stopPropagation(event);
  }

  function onPointerDown(event) {
    stopPropagation(event);

    selectNode(event.target, { origin: event.isTrusted ? 'click' : 'script' });
  }

  function onPointerOver(event) {
    stopPropagation(event);

    const target = event.target;
    if (target.tagName === 'IFRAME') {
      try {
        if (!iframesListeningTo.has(target)) {
          const window = target.contentWindow;
          addEventListeners(window);
          iframesListeningTo.add(target);
        }
      } catch (error) {
        // This can error when the iframe is on a cross-origin.
      }
    }

    showOverlay([target], false);
    selectNode(target, { origin: event.isTrusted ? 'hover' : 'script' });
  }

  function onPointerUp(event) {
    stopPropagation(event);
  }

  const selectNode = throttle(
    memoize(onSelectNode),
    200,
    // Don't change the selection in the very first 200ms
    // because those are usually unintentional as you lift the cursor.
    { leading: false },
  );

  return {
    clear: clearHighlights,
    highlight: highlightElements,
    stop: stopInspecting,
    start: startInspecting,
  };
}
