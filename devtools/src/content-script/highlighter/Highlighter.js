/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * Copyright (c) 2020, Stephan Meijer
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 **/

import Overlay from './Overlay';

const SHOW_DURATION = 2000;

let timeoutID = null;
let overlay = null;

export function hideOverlay() {
  timeoutID = null;

  if (overlay !== null) {
    overlay.remove();
    overlay = null;
  }
}

export function showOverlay(elements, hideAfterTimeout) {
  if (window.document == null) {
    return;
  }

  if (timeoutID !== null) {
    clearTimeout(timeoutID);
  }

  if (elements == null) {
    return;
  }

  if (overlay === null) {
    overlay = new Overlay();
  }

  overlay.inspect(elements);

  if (hideAfterTimeout) {
    timeoutID = setTimeout(hideOverlay, SHOW_DURATION);
  }
}
