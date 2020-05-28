const fs = require('fs');
const path = require('path');
const queryString = require('query-string');

const filename = path.join(__dirname, './index.html');
const indexHtml = fs.readFileSync(filename, 'utf8');

function getHostname(event, context) {
  if (event.headers.host) {
    return `http://${event.headers.host}`;
  }

  const netlify = (context.clientContext.custom || {}).netlify;
  const decoded = JSON.parse(Buffer.from(netlify, 'base64').toString('utf-8'));
  return decoded.site_url;
}

function handler(event, context, callback) {
  const params = event.queryStringParameters;

  const host = getHostname(event, context);

  const { panes, markup, query } = params;
  const oembedSearch = queryString.stringify({
    url: `${host}/embed?${queryString.stringify({ panes, markup, query })}`,
    format: 'json',
  });

  const oembedLink = `<link type="application/json+oembed" href="${host}/oembed?${oembedSearch}" title="Testing Playground" />`;

  let body = indexHtml.replace(
    /<(\w+)\s[^>]*type="application\/json\+oembed".*?>/g,
    oembedLink,
  );

  return callback(null, {
    statusCode: 200,
    body: body,
    headers: {
      'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=300',
      'Content-Type': 'text/html; charset=UTF-8',
    },
  });
}

module.exports = { handler };
