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
    }
    if (entry.url.includes('client/')) {
      const replaced = entry.url.replace('client/', '');
      entry.url = replaced;
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
};
