function incorrectParams(error) {
  return {
    statusCode: 501, // oembed status // 422, // Unprocessable Entity
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error }),
  };
}

function getHostname(event, context) {
  if (event.headers.host) {
    return `http://${event.headers.host}`;
  }

  const { netlify } = context.clientContext.custom || {};

  return JSON.parse(Buffer.from(netlify, 'base64').toString('utf-8')).site_url;
}

function handler(event, context, callback) {
  const host = getHostname(event, context);
  const params = event.queryStringParameters;

  if (params.format === 'xml') {
    return callback(
      null,
      incorrectParams('unsupported format, only json is supported'),
    );
  }

  if (!params.url) {
    return callback(
      null,
      incorrectParams('seems like you forgot to provide an url :/'),
    );
  }

  const { url, referrer, maxwidth = 900, maxheight = 300 } = params;

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(
      {
        version: '1.0',
        type: 'rich',
        success: true,

        provider_name: 'testing-playground.com',
        provider_url: host,

        html: `<iframe src="${url}" height="${maxheight}" width="${maxwidth}" scrolling="no" frameBorder="0" allowTransparency="true" title="Testing Playground" style="overflow: hidden; display: block; width: 100%"></iframe>`,
        width: maxwidth,
        height: maxheight,

        thumbnail_url: `${host}/icon.png`,
        thumbnail_width: 512,
        thumbnail_height: 512,

        referrer,
        cache_age: 3600,
      },
      '',
      '  ',
    ),
  });
}

module.exports = { handler };
