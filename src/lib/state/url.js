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
  const { hash, search } = window.location;

  // try to migrate old hash based format
  // .com/#markupLz&queryLz
  if (hash.includes('&')) {
    const [markup, query] = hash.slice(1).split('&');
    const decompressed = decompress({ markup, query });

    if (decompressed.markup && decompressed.query) {
      save(decompressed);
    }
  }

  // .com?markup=markupLz&query=queryLz
  const { markup, query } = queryString.parse(search);
  return decompress({ markup, query });
}

export default {
  save,
  load,
};
