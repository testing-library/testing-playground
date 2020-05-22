import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

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

function load() {
  const [htmlCompressed, jsCompressed] = window.location.hash
    .slice(1)
    .split('&');

  console.log('load', { htmlCompressed, jsCompressed });

  return {
    html: htmlCompressed && decompressFromEncodedURIComponent(htmlCompressed),
    js: jsCompressed && decompressFromEncodedURIComponent(jsCompressed),
  };
}

const state = {
  save,
  load,
};

export default state;
