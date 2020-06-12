const { copy, remove } = require('fs-extra');
const { resolve } = require('path');

async function main() {
  const dest = resolve('dist/server');
  await remove(dest);

  await copy('src/lambda', dest);
  await copy('dist/client/index.html', 'dist/server/server/index.html');
}

main();
