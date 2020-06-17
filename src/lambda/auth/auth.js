const authorization = require('./oauth.helper');

function getHostname(event, context) {
  if (event.headers.host) {
    return `http://${event.headers.host}`;
  }

  const { netlify } = context.clientContext.custom || {};

  return JSON.parse(Buffer.from(netlify, 'base64').toString('utf-8')).site_url;
}

function handler(event, context, callback) {
  const host = getHostname(event, context);

  const authorizationURI = authorization.authorizationCode.authorizeURL({
    redirect_uri: `${host}/.netlify/functions/auth-callback`,
    scope: 'gist',
    state: '',
  });

  const response = {
    statusCode: 302,
    headers: {
      Location: authorizationURI,
      'Cache-Control': 'no-cache',
    },
    body: '',
  };

  return callback(null, response);
}

module.exports = { handler };
