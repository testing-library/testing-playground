function incorrectParams(error) {
  return {
    statusCode: 422, // Unprocessable Entity
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error }),
  };
}

function handler(event, context, callback) {
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

  const { url, maxwidth = '100%', maxheight = '400px' } = params;

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(
      {
        version: '1.0',
        type: 'rich',
        success: true,

        provider_name: 'Testing-Playground',
        provider_url: 'https://testing-playground.com',

        author_name: 'Testing Playground',
        author_url: 'https://testing-playground.com',

        html: `<iframe src="${url}" width="${maxwidth}" height="${maxheight}" scrolling="no" frameborder="0" allowtransparency="true" allowfullscreen="true" title="Testing Playground" style="overflow: hidden; display: block;" loading="lazy" name="testing-playground-${Date.now()}"></iframe>`,
        width: maxwidth,
        height: maxheight,

        thumbnail_url: 'https://testing-playground.com/public/icon.png',
        thumbnail_width: 512,
        thumbnail_height: 512,

        referrer: '',
        cache_age: 3600,
      },
      '',
      '  ',
    ),
  });
}

module.exports = { handler };
