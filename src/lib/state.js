import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

import beautify from 'js-beautify';

function unindent(string) {
  return string.replace(/[ \t]*[\n][ \t]*/g, '\n');
}

function save({ html, js }) {
  const state = [
    compressToEncodedURIComponent(unindent(html)),
    compressToEncodedURIComponent(unindent(js)),
  ].join('&');

  history.replaceState(null, '', window.location.pathname + '#' + state);
}

const beautifyOptions = {
  indent_size: 2,
  wrap_line_length: 72,
  wrap_attributes: 'force-expand-multiline',
};

function load() {
  const [htmlCompressed, jsCompressed] = window.location.hash
    .slice(1)
    .split('&');

  return {
    html:
      htmlCompressed &&
      beautify.html(
        decompressFromEncodedURIComponent(htmlCompressed),
        beautifyOptions,
      ),
    js:
      jsCompressed &&
      beautify.js(
        decompressFromEncodedURIComponent(jsCompressed),
        beautifyOptions,
      ),
  };
}

window.beautify = beautify;

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
