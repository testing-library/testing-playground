import {
  screen,
  within,
  getSuggestedQuery,
  fireEvent,
} from '@testing-library/dom';
window.__TESTING_PLAYGROUND__ = window.__TESTING_PLAYGROUND__ || {};

function augmentQuery(query) {
  return (...args) => {
    const result = query(...args);

    // Promise.resolve(result).then((x) => {
    //   if (x.nodeType) {
    //     window.inspect(x);
    //   }
    // });

    return result;
  };
}

export function setup(view) {
  // monkey patch `screen` to add testing library to console
  for (const prop of Object.keys(screen)) {
    view.screen[prop] = view.screen[prop] || augmentQuery(screen[prop]);
    view[prop] = view.screen[prop];
  }

  view.fireEvent = fireEvent;
  view.getSuggestedQuery = getSuggestedQuery;
  view.within = within;

  view.container = view.document.body;
}

setup(window);
