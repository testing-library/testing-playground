function render(html, { container = document.createElement('div') } = {}) {
  container.innerHTML = html;
  return container;
}

function renderIntoDocument(html) {
  return render(html, { container: document.body });
}

function cleanup() {
  document.body.innerHTML = '';
}

afterEach(cleanup);

export { render, renderIntoDocument, cleanup };
