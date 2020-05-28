import { compress } from './lib/state';
import queryString from 'query-string';

function initPlaygrounds() {
  const playgrounds = document.querySelectorAll('[data-testing-playground]');

  // TODO: figure out how to run / build statics with parcel
  const host =
    process.env.NODE_ENV !== 'production'
      ? 'http://localhost:1234'
      : new URL(document.currentScript.src).origin;

  for (let i = 0; i < playgrounds.length; i++) {
    const playground = playgrounds[i];

    let markup = playground.dataset.markup;
    let query = playground.dataset.query;

    if ((!markup || !query) && playground.tagName === 'TEMPLATE') {
      markup = playground.content
        .querySelector('script[type="text/html"]')
        ?.innerText.trim();
      query = playground.content
        .querySelector('script[type="text/javascript"]')
        ?.innerText.trim();

      const compressed = compress({ markup, query });
      markup = compressed.markup;
      query = compressed.query;
    }

    const { panes, ...options } = Object.assign(
      {
        height: 300,
        width: '100%',
        scrolling: 'no',
        frameBorder: 0,
        allowTransparency: true,
        title: 'Testing Playground',
        style: 'overflow: hidden; display: block;',
        loading: 'lazy',
        name: `testing-playground-embed-${i}`,
      },
      playground.dataset,
      {
        class: ['testing_playground_embed_iframe', playground.dataset.class]
          .filter(Boolean)
          .join(' '),
      },
    );

    const search = queryString.stringify({
      panes,
      markup,
      query,
    });

    const src = `${host}/embed?${search}`;

    const fragment = document.createDocumentFragment();
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', src);

    for (const [key, value] of Object.entries(options)) {
      iframe.setAttribute(key, value);
    }

    fragment.appendChild(iframe);

    if (playground.parentNode) {
      const div = document.createElement('div');
      div.appendChild(fragment);
      playground.parentNode.replaceChild(div, playground);
    } else {
      playground.appendChild(fragment);
    }
  }
}

function onDocReady(fn) {
  if (document.readyState !== 'loading') {
    return fn();
  }

  setTimeout(() => {
    onDocReady(fn);
  }, 9);
}

onDocReady(initPlaygrounds);

//
//
//
// <p className="codepen" data-height="265" data-theme-id="default" data-default-tab="js,result" data-user="smeijer"
//    data-slug-hash="VPVqjZ"
//    style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;"
//    data-pen-title="VPVqjZ">
//   <span>See the Pen <a href="https://codepen.io/smeijer/pen/VPVqjZ">
//   VPVqjZ</a> by Stephan Meijer (<a href="https://codepen.io/smeijer">@smeijer</a>)
//   on <a href="https://codepen.io">CodePen</a>.</span>
// </p>
// <script async src="https://static.codepen.io/assets/embed/ei.js"></script>
