const { ensureDir } = require('fs-extra');
const Parcel = require('@parcel/core').default;
const getPort = require('get-port');
const { NodePackageManager } = require('@parcel/package-manager');
const { NodeFS } = require('@parcel/fs');

// see here for options:
//   https://github.com/parcel-bundler/parcel/blob/v2/packages/core/parcel/src/cli.js

const isProduction = process.env.NODE_ENV === 'production';

async function build({ entries, dest, port, serve = !isProduction }) {
  await ensureDir(dest);

  const packageManager = new NodePackageManager(new NodeFS());
  const defaultConfig = await packageManager.require(
    '@parcel/config-default',
    __filename,
    { autoinstall: !isProduction },
  );

  const config = {
    entries,
    distDir: dest,
    packageManager,
    defaultConfig: {
      ...defaultConfig,
      filePath: (
        await packageManager.resolve('@parcel/config-default', __filename, {
          autoinstall: !isProduction,
        })
      ).resolved,
    },
    patchConsole: true,
    mode: isProduction ? 'production' : 'development',
    sourceMaps: true,
  };

  if (serve !== false && port) {
    config.serve = { port: await getPort({ port }) };
    config.hot = { port: await getPort() };
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
