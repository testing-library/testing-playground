const {
  copy,
  remove,
  readFile,
  writeFile,
  readdir,
  rename,
} = require('fs-extra');
const { resolve, join } = require('path');
const { build } = require('./build');
const { openInBrowser } = require('@parcel/utils');
const workbox = require('workbox-build');

const hashRegExp = /\.[0-9a-fA-F]{8}\./;

const removeRevisionManifestTransform = async (manifestEntries) => ({
  manifest: manifestEntries.map((entry) =>
    hashRegExp.test(entry.url) ? { ...entry, revision: null } : entry,
  ),
});

const workboxConfig = {
  globDirectory: 'dist/client',
  globPatterns: ['**/*.{html,js,css,png,svg,jpg,gif,json,ico}'],
  swDest: 'dist/client/sw.js',
  clientsClaim: true,
  skipWaiting: true,
  manifestTransforms: [removeRevisionManifestTransform],
  ignoreURLParametersMatching: [/.*/],
};

async function fixWebManifest({ dest }) {
  // browsers can't detect service-worker updates if the manifest changes name
  const htmlContent = await readFile(join(dest, 'index.html'), 'utf8');
  const [, manifestFilename] = htmlContent.match(
    /<link rel="manifest" href="\/?(site\.[0-9a-fA-F]{8}\.webmanifest)">/,
  );

  // replace site.e5465fc8.webmanifest with manifest.json
  const replacer = new RegExp(manifestFilename, 'g');
  const newContent = htmlContent.replace(replacer, 'manifest.json', 'utf8');

  // fix image paths in manifest.json
  const iconSrcHashTable = (await readdir(dest))
    .filter((file) => /\.png/.test(file))
    .reduce((index, file) => {
      index[file.replace(hashRegExp, '.')] = file;
      return index;
    }, {});

  const manifest = JSON.parse(
    await readFile(join(dest, manifestFilename), 'utf8'),
  );

  manifest.icons.forEach((icon) => {
    icon.src = iconSrcHashTable[icon.src];
  });

  await Promise.all([
    // rename manifest file from site.e5465fc8.webmanifest to manifest.json
    remove(join(dest, manifestFilename)),
    // write updated html content referring to the renamed manifest
    writeFile(join(dest, 'index.html'), newContent),
    // write the fixed manifest json
    writeFile(
      join(dest, 'manifest.json'),
      JSON.stringify(manifest, '', '  '),
      'utf8',
    ),
  ]);
}

async function fixHtml({ dest }) {
  const htmlContent = await readFile(join(dest, 'index.html'), 'utf8');

  const [, ogImageName] = htmlContent.match(
    /<meta property="og:image" content="\/?(site\.[0-9a-fA-F]{8}\.jpg)">/,
  );

  // temp name: /site.a47b3adf.jpg

  const replacer = new RegExp(`/${ogImageName}`, 'g');
  const newContent = htmlContent.replace(
    replacer,
    'https://testing-playground.com/site.a47b3adf.jpg',
    'utf8',
  );

  await Promise.all([
    rename(join(dest, ogImageName), join(dest, 'site.a47b3adf.jpg')),
    writeFile(join(dest, 'index.html'), newContent, 'utf8'),
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

  await fixWebManifest({ dest });
  await fixHtml({ dest });

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
