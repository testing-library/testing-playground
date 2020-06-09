const removeRevisionTransform = async (manifestEntries) => {
  const manifest = manifestEntries.map((entry) => {
    const hashRegExp = /\.\w{8}\./;
    if (entry.url.match(hashRegExp)) {
      entry.revision = null;
    }
    return entry;
  });
  return { manifest, warnings: [] };
};

const removePath = async (manifestEntries) => {
  const manifest = manifestEntries.map((entry) => {
    if (entry.url.includes('index.html')) {
      entry.url = 'index.html';
    } else if (entry.url.includes('webmanifest')) {
      const replaced = entry.url.replace('client/', '');
      entry.url = replaced;
    } else if (
      entry.url.includes('public') &&
      !entry.url.includes('webmanifest')
    ) {
      const replaced = entry.url.replace('client/', '');
      entry.url = replaced;
    } else if (
      entry.url.includes('client/') &&
      !entry.url.includes('public') &&
      !entry.url.includes('webmanifest')
    ) {
      const split = entry.url.split('/');
      const filePath = split.pop();
      entry.url = filePath;
    }
    return entry;
  });
  return { manifest, warnings: [] };
};

module.exports = {
  globDirectory: 'dist',
  globPatterns: ['**/*.{html,js,css,png,svg,jpg,gif,json,ico,webmanifest}'],
  swDest: 'dist/client/sw.js',
  clientsClaim: true,
  skipWaiting: true,
  manifestTransforms: [removeRevisionTransform, removePath],
  ignoreURLParametersMatching: [/.*/],
};
