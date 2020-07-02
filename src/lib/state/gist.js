import beautify from '../beautify';

const endpoint = '/api/gist';

async function save({ config, id, markup, query }) {
  // if id is undefined, the backend will create a new gist. Otherwise, the gist
  // will get a new revision.
  const response = await fetch([endpoint, id].filter(Boolean).join('/'), {
    method: id ? 'PATCH' : 'POST',
    body: JSON.stringify({
      files: {
        'playground.json': { content: JSON.stringify(config, '', '  ') },
        'source.html': { content: beautify.html(markup) },
        'source.js': { content: beautify.js(query) },
      },
    }),
  });

  const data = await response.json();
  console.log('saved', data);

  // history.replaceState(null, '', window.location.pathname + '?' + search);
}

async function load({ id, version }) {
  const response = await fetch(
    [endpoint, id, version].filter(Boolean).join('/'),
  );

  const data = await response.json();
  data.files['playground.json'] = JSON.parse(data.files['playground.json']);

  console.log('loaded', data);
}

export default {
  save,
  load,
};
