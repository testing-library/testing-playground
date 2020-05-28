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

  const netlify = (context.clientContext.custom || {}).netlify;
  const decoded = JSON.parse(Buffer.from(netlify, 'base64').toString('utf-8'));
  return decoded.site_url;
}

function handler(event, context, callback) {
  const host = getHostname(event, context);
  const params = event.queryStringParameters;

  if (params.format !== 'json') {
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

        provider_name: 'Testing-Playground',
        provider_url: host,

        author_name: 'Testing Playground',
        author_url: host,

        html: `<iframe src="${url}" width=${maxwidth} height=${maxheight} scrolling="no" frameborder="0" allowtransparency="true" allowfullscreen="true" title="Testing Playground" style="overflow: hidden; display: block;" loading="lazy" name="testing-playground-${Date.now()}"></iframe>`,
        width: maxwidth,
        height: maxheight,

        thumbnail_url: `${host}/public/icon.png`,
        thumbnail_width: 512,
        thumbnail_height: 512,

        referrer: referrer,
        cache_age: 3600,
      },
      '',
      '  ',
    ),
  });
}

module.exports = { handler };
