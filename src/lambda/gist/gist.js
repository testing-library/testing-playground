const fetch = require('isomorphic-fetch');
const ENDPOINT = 'https://api.github.com/gists';
const authorization = `token ${process.env.GITHUB_GIST_TOKEN}`;

function incorrectParams(error) {
  return {
    statusCode: 422, // Unprocessable Entity
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error }),
  };
}

function json(data) {
  return {
    statusCode: 200,
    body: JSON.stringify(data, null, '  '),
  };
}

function hasFileWithContent(files, filename) {
  return (
    files[filename] &&
    typeof files[filename].content === 'string' &&
    Object.keys(files[filename]).length === 1
  );
}

function matchExpectedFiles(files) {
  return (
    typeof files === 'object' &&
    // check length, because we don't allow additional files
    Object.keys(files).length === 3 &&
    hasFileWithContent(files, 'playground.json') &&
    hasFileWithContent(files, 'source.html') &&
    hasFileWithContent(files, 'source.js')
  );
}

async function getGist({ id, version }) {
  const response = await fetch(
    [ENDPOINT, id, version].filter(Boolean).join('/'),
  );

  const { files } = await response.json();

  Object.keys(files || {}).forEach((key) => {
    files[key] = { content: files[key].content };
  });

  // { id: string, version: string, files: { [string]: { content: string } }
  return { id, version, files };
}

/**
 * @param id {string}
 * @param description {string}
 * @param files { object.<string, { content: string }>}
 * @returns {Promise<{id: *, version: *, url: string}>}
 */
async function saveGist({ id, description, files }) {
  // if the id is given, we assume an update and thereby just correct the method.
  const response = await fetch([ENDPOINT, id].filter(Boolean).join('/'), {
    method: id ? 'PATCH' : 'POST',
    headers: { authorization },
    body: JSON.stringify({ description, files }),
  });

  const data = await response.json();
  const link = `https://testing-playground.com/gist/${data.id}`;
  const permaLink = `${link}/${data.history[0].version}`;

  if (!id || data.description !== permaLink) {
    // in case the id wasn't provided, we're creating a new gist. Update
    // the gist to add the playground link to it's description. As we don't
    // know the gist id beforehand, we can't do this in a single run :(
    fetch([ENDPOINT, data.id].join('/'), {
      method: 'PATCH',
      headers: { authorization },
      body: JSON.stringify({
        description: link,
      }),
    });
  }

  return {
    id: data.id,
    version: data.history[0].version,
    url: permaLink,
  };
}

async function handler(event, context, callback) {
  const method = event.httpMethod.toUpperCase();

  const path = event.path.split('/');
  // id: string, version: string, action = 'fork' | undefined
  const [id, version, action] = path.slice(path.indexOf('gist') + 1);

  // handle gist retrieval
  // GET api/gist/id/version
  if (method === 'GET') {
    const data = await getGist({ id, version });

    // we check the files, to be sure that given gist-id is something that
    // playground will understand
    if (!matchExpectedFiles(data.files)) {
      return callback(null, incorrectParams('invalid id provided'));
    }

    return callback(null, json(data));
  }

  // github can fork gists, but doesn't allow forking under the same account
  // and it also doesn't allow forking specific revisions (commits). Hence
  // we just fetch the gist, and submit it as a new one instead.
  if (method === 'POST' && (action === 'fork' || version === 'fork')) {
    const { files } = await getGist({ id, version });

    // we still verify the files, as we can't be sure that the gist hasn't been
    // updated externally (via github interface, or even git cli)
    if (!matchExpectedFiles(files)) {
      return callback(null, incorrectParams('unsupported files provided'));
    }

    const data = await saveGist({ files });
    return callback(null, json(data));
  }

  // handle saving to gist, POST for creation and PATCH for updates
  if (method === 'POST' || method === 'PATCH') {
    const { files } = JSON.parse(event.body);

    // check if the provided files match our expectations
    if (!matchExpectedFiles(files)) {
      return callback(null, incorrectParams('unsupported files provided'));
    }

    const data = await saveGist({ id, files });
    return callback(null, json(data));
  }

  return callback(null, incorrectParams('What did you do? o.O'));
}

module.exports = { handler };
