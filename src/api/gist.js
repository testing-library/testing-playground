const headers = {
  'Content-Type': 'application/json',
};

function getBody({ markup, query, settings }) {
  return JSON.stringify({
    files: {
      'playground.json': { content: JSON.stringify(settings) },
      'source.html': { content: markup },
      'source.js': { content: query },
    },
  });
}

function getContent(data) {
  return {
    settings: JSON.parse(data.files['playground.json'].content),
    markup: data.files['source.html'].content,
    query: data.files['source.js'].content,
  };
}

const gist = {
  async fetch({ id, version }) {
    const url = version ? `/api/gist/${id}/${version}` : `/api/gist/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    return getContent(data);
  },

  async save({ id, markup, query, settings }) {
    const url = id ? `/api/gist/${id}` : '/api/gist';

    const response = await fetch(url, {
      method: id ? 'PATCH' : 'POST',
      headers,
      body: getBody({ markup, query, settings }),
    });

    return response.json();
  },

  async fork({ id, version }) {
    const url = version
      ? `/api/gist/${id}/${version}/fork`
      : `/api/gist/${id}/fork`;

    const response = await fetch(url, {
      method: 'POST',
      headers,
    });

    return response.json();
  },
};

export default gist;
