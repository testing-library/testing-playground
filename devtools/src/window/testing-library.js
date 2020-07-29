import {
  screen,
  within,
  getSuggestedQuery,
  fireEvent,
  getRoles,
} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

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

  view.getRoles = getRoles;
  view.fireEvent = fireEvent;
  view.getSuggestedQuery = getSuggestedQuery;
  view.within = within;

  view.container = view.document.body;
  view.userEvent = userEvent;
  view.user = userEvent;
}

setup(window);
