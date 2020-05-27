import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

import beautify from 'js-beautify';

function unindent(string) {
  return (string || '').replace(/[ \t]*[\n][ \t]*/g, '\n');
}

export function compress({ html, js }) {
  return [
    compressToEncodedURIComponent(unindent(html)),
    compressToEncodedURIComponent(unindent(js)),
  ].join('&');
}

export function decompress({ html, js }) {
  return {
    html: beautify.html(
      decompressFromEncodedURIComponent(html || ''),
      beautifyOptions,
    ),
    js: beautify.js(
      decompressFromEncodedURIComponent(js || ''),
      beautifyOptions,
    ),
  };
}

function save({ html, js }) {
  const state = compress({ html, js });
  const { search, pathname } = window.location;
  history.replaceState(
    null,
    '',
    pathname + (search ? search : '') + '#' + state,
  );
}

const beautifyOptions = {
  indent_size: 2,
  wrap_line_length: 72,
  wrap_attributes: 'force-expand-multiline',
};

function load() {
  const [html, js] = window.location.hash.slice(1).split('&');

  return decompress({ html, js });
}

function updateTitle(text) {
  const title = document.title.split(':')[0];

  if (!text || text.length === 0) {
    document.title = title;
    return;
  }

  const suffix = text.replace(/\s+/g, ' ').substring(0, 1000).trim();
  document.title = title + ': ' + suffix;
}

const state = {
  save,
  load,
  updateTitle,
};

export default state;
