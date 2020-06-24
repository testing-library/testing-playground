function render(html, { container = document.createElement('div') } = {}) {
  container.innerHTML = html;
  function rerender(newHtml) {
    return render(newHtml, { container });
  }
  return { container, rerender };
}

function renderIntoDocument(html) {
  return render(html, { container: document.body });
}

function cleanup() {
  document.body.innerHTML = '';
}

afterEach(cleanup);

export { render, renderIntoDocument, cleanup };
