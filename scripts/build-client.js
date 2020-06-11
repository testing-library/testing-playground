const { copy, remove, move, readFile, writeFile } = require('fs-extra');
const { resolve, join } = require('path');
const { build } = require('./build');
const { openInBrowser } = require('@parcel/utils');
const workbox = require('workbox-build');

const hashRegExp = /\.\[0-9a-fA-F]{8}\./;

const removeRevisionManifestTransform = async (manifestEntries) => ({
  manifest: manifestEntries.map((entry) =>
    hashRegExp.test(entry.url) ? { ...entry, revision: null } : entry,
  ),
});

const workboxConfig = {
  globDirectory: 'dist/client',
  globPatterns: ['**/*.{html,js,css,png,svg,jpg,gif,json,ico,webmanifest}'],
  swDest: 'dist/client/sw.js',
  clientsClaim: true,
  skipWaiting: true,
  manifestTransforms: [removeRevisionManifestTransform],
  ignoreURLParametersMatching: [/.*/],
};

async function renameWebManifest({ dest }) {
  const htmlContent = await readFile(join(dest, 'index.html'), 'utf-8');
  const [, file] = htmlContent.match(
    /<link rel="manifest" href="\/?(site\.[0-9a-fA-F]{8}\.webmanifest)">/,
  );

  // replace site.e5465fc8.webmanifest with webmanifest.json
  const replacer = new RegExp(file, 'g');
  const newContent = htmlContent.replace(replacer, 'webmanifest.json');

  await Promise.all([
    // rename manifest file from site.e5465fc8.webmanifest to webmanifest.json
    move(join(dest, file), join(dest, 'webmanifest.json')),
    // write updated html content referring to the renamed manifest
    writeFile(join(dest, 'index.html'), newContent),
  ]);
}

async function main() {
  const dest = resolve('dist/client');
  await remove(dest);

  const entries = ['src/index.html', 'src/embed.js'];

  if (process.env.NODE_ENV === 'development') {
    entries.push('src/embed.html');
  }

  const parcel = await build({
    entries,
    dest: 'dist/client',
    port: 1234,
  });

  // browsers can't detect service-worker updates if the webmanifest changes name
  await renameWebManifest({ dest });

  await workbox.generateSW(workboxConfig);

  await Promise.all([
    copy('_redirects', join(dest, '_redirects')),
    copy('public/favicon.ico', join(dest, 'favicon.ico')),
    copy('public/icon.png', join(dest, 'icon.png')),
    copy('.well-known', join(dest, '.well-known')),
  ]);

  if (parcel.watching) {
    openInBrowser(`http://localhost:${parcel.config.serve.port}`);
  }
}

main();
