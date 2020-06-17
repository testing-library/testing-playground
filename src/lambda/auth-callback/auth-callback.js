const oauthClient = require('../auth/oauth.helper');

function getHostname(event, context) {
  if (event.headers.host) {
    return `http://${event.headers.host}`;
  }

  const { netlify } = context.clientContext.custom || {};

  return JSON.parse(Buffer.from(netlify, 'base64').toString('utf-8')).site_url;
}

function handler(event, context, callback) {
  const host = getHostname(event, context);
  const code = event.queryStringParameters.code;
  const state = event.queryStringParameters.state;

  oauthClient
    .getToken({
      code: code,
      state: state,
      redirect_uri: `${host}/auth-callback`,
    })
    .then((result) => {
      const response = {
        statusCode: 302,
        headers: {
          Location: `${host}/login?access_token=${result.token.access_token}`,
          'Cache-Control': 'no-cache',
        },
        body: '',
      };
      return callback(null, response);
    })
    .catch((error) => {
      return callback(null, {
        statusCode: error.statusCode || 500,
        body: JSON.stringify({
          error: error.message,
        }),
      });
    });
}

module.exports = { handler };
