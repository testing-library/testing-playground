const fs = require('fs');
const path = require('path');
const queryString = require('query-string');

const filename = path.join(__dirname, './index.html');
const indexHtml = fs.readFileSync(filename, 'utf8');

function getHostname(event, context) {
  if (event.headers.host) {
    return `http://${event.headers.host}`;
  }

  const { netlify } = context.clientContext.custom || {};

  return JSON.parse(Buffer.from(netlify, 'base64').toString('utf-8')).site_url;
}

function handler(event, context, callback) {
  const { panes, markup, query } = event.queryStringParameters;
  const host = getHostname(event, context);

  const frameSrc = `${host}/embed?${queryString.stringify({ panes, markup, query })}`;

  const oembedSearch = queryString.stringify({ url: frameSrc });

  const oembedLink = [
    `<link rel="alternate" type="application/json+oembed" href="${host}/oembed?${oembedSearch}" title="Testing Playground" />`,
    `<link rel="iframely player" type="text/html" href="${frameSrc}" media="height: 300" />`,
  ].join('');

  let body = indexHtml.replace(
    /<(\w+)\s[^>]*type="application\/json\+oembed".*?>/g,
    oembedLink,
  );

  return callback(null, {
    statusCode: 200,
    body,
    headers: {
      'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=300',
      'Content-Type': 'text/html; charset=UTF-8',
    },
  });
}

module.exports = { handler };
