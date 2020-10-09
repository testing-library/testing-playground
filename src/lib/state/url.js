import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import queryString from 'query-string';

import beautify from '../beautify';

function unindent(string) {
  return (string || '').replace(/[ \t]*[\n][ \t]*/g, '\n');
}

export function compress({ markup, query }) {
  const result = {
    markup: compressToEncodedURIComponent(unindent(markup)),
    query: compressToEncodedURIComponent(unindent(query)),
  };

  return result;
}

export function decompress({ markup, query }) {
  const result = {
    markup: beautify.html(decompressFromEncodedURIComponent(markup || '')),
    query: beautify.js(decompressFromEncodedURIComponent(query || '')),
  };

  return result;
}

function save({ markup, query }) {
  const state = compress({ markup, query });

  const params = queryString.parse(window.location.search);
  const search = queryString.stringify({
    ...params,
    ...state,
  });

  history.replaceState(null, '', window.location.pathname + '?' + search);
}

function load() {
  // .com?markup=...&query=...
  let params = queryString.parse(location.search);

  // .com#markup=...&query=...
  if (!params.markup && !params.query) {
    params = queryString.parse(location.hash);
  }

  if (!params.markup && !params.query) {
    return;
  }

  const { markup, query } = decompress(params);
  // we could call `save({ markup, query })` here to force migration. Should we?
  // not migrating them can be confusing, as the url style doesn't update on change

  return { markup, query };
}

export default {
  save,
  load,
};
