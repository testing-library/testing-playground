const { authorization } = require('./oauth.helper');

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

  authorization.authorizationCode
    .getToken({
      code: code,
      state: state,
      redirect_uri: `${host}/.netlify/functions/auth-callback`,
    })
    .then((result) => {
      console.log('accessToken', result);
      const response = {
        statusCode: 200,
        body: JSON.stringify(result),
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
