const fs = require('fs');
const path = require('path');
const queryString = require('query-string');

const filename = path.join(__dirname, './index.html');
const indexHtml = fs.readFileSync(filename, 'utf8');

function handler(event, context, callback) {
  const params = event.queryStringParameters;

  const host =
    event.headers.host && event.headers.host.includes(':')
      ? `http://${event.headers.host}`
      : `https://testing-playground.com`;

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

  body += '<!-- server rendered -->';

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
