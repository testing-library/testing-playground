import beautify from 'js-beautify';

const beautifyOptions = {
  indent_size: 2,
  wrap_line_length: 80,
  wrap_attributes: 'force-expand-multiline',
};

function html(html) {
  return beautify.html(html, beautifyOptions);
}

function js(js) {
  return beautify.js(js, beautifyOptions);
}

function format(mode, content) {
  if (mode === 'htmlmixed' || mode === 'html') {
    return html(content);
  }

  if (mode === 'javascript') {
    return js(content);
  }

  return content;
}

export default {
  html,
  js,
  format,
};
