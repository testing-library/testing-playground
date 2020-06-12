const { ensureDir } = require('fs-extra');
const Parcel = require('@parcel/core').default;
const getPort = require('get-port');

async function build({
  entries,
  dest,
  port,
  serve = process.env.NODE_ENV !== 'production',
}) {
  await ensureDir(dest);

  const config = {
    entries,
    distDir: dest,
  };

  if (serve !== false && port) {
    config.serve = { port: await getPort({ port }) };
  } else {
    config.mode = 'production';
  }

  const parcel = new Parcel(config);

  return new Promise((resolve, reject) => {
    const callback = (err, build) => {
      if (err) {
        return reject(err);
      }

      resolve({ build, config, watching: serve });
    };

    if (serve) {
      parcel.watch(callback);
    } else {
      parcel
        .run()
        .then((build) => resolve({ build, config, watching: false }))
        .catch(reject);
    }
  });
}

module.exports = {
  build,
};
