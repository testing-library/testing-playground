import beautify from 'js-beautify';

const beautifyOptions = {
  indent_size: 2,
  wrap_line_length: 72,
  wrap_attributes: 'force-expand-multiline',
};

function beautifyHtml(html) {
  return beautify.html(html, beautifyOptions);
}

function beautifyJs(js) {
  return beautify.js(js, beautifyOptions);
}

export default {
  beautifyHtml,
  beautifyJs,
};
