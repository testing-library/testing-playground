#!/usr/bin/env -S npx tsx
import { argv, path, fs } from 'zx';
import { build } from 'vite';
import {config} from './vite.config.mjs';
import { resolve as r, __DEV__ } from './utils.mjs'
import webExt from 'web-ext';

const TARGETS = ['chromium', 'firefox-desktop'];
const { target } = argv;

if (!TARGETS.includes(target)) {
  console.log(`
    Invalid target: ${target}, must be one of ${TARGETS.join(', ')}
   
    Usage:
       ./scripts/build-extension.mts --target chromium
       ./scripts/build-extension.mts --target firefox-desktop
  `);
  process.exit(1);
}

const root = r('devtools/src');
const dest = r(`dist/${target}-extension`);

const entries =  [
  'devtools/main.html',
  'devtools/pane.html',
  'devtools/panel.html',
  'content-script/content-script.js',
  'background/background.js',
  'window/testing-library.js',
];

await fs.rm(dest, { recursive: true, force: true });
for (const entry of entries)
{
  const isHTML = /\.html$/.test(entry);
  const dirname = path.dirname(entry);
  const basename = path.basename(entry);

  const libEntry = r(root, entry.replace(/\.html$/, '.js'));
  const entryFileNames = `${dirname}/${basename.replace(/\.html$/, '.js')}`;

  await new Promise((resolve) =>
    build({
      ...config,
      plugins: [
        ...config.plugins,
        { name: 'done', buildEnd: resolve },
      ],
      root,
      build: {
        watch: __DEV__ ? {} : null,
        sourcemap: __DEV__ ? 'inline' : false,
        outDir: r(`dist/${target}-extension`),
        emptyOutDir: false,
        minify: false,
        cssCodeSplit: false,
        lib: isHTML ? undefined : {
          entry: libEntry,
          fileName: (_, name) => `${dirname}/${name}.js`,
          formats: ['iife'],
          name: entry,
        },
        rollupOptions: isHTML ? {
          input: r(root, entry),
          output: {
            entryFileNames,
            manualChunks: () => null,
            preserveModules: false,
          }
        } : undefined,
      }
    })
  );
}

await fs.copy(r(root, 'manifest.json'), r(dest, 'manifest.json'));
await fs.mkdir(r(dest, 'icons'), { recursive: true });
const manifest = await fs.readJson(r(dest, 'manifest.json'));

await Promise.all(
  Object.values(manifest.icons).map((icon: string) =>
    fs.copyFile(r('public', icon), r(dest, icon)),
  ),
);

if (__DEV__) {
  webExt.cmd.run({ sourceDir: dest, target, browserConsole: true, startUrl: 'https://meijer.ws' });
} else {
  webExt.cmd.build({
    sourceDir: dest,
    target,
    artifactsDir: r('dist'),
    overwriteDest: true,
    filename: `${manifest.name}-${manifest.version}-${target}.zip`.replace(/\s/g, '-').toLowerCase(),
  });
}
