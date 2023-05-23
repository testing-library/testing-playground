import { defineConfig } from 'vitest/config';
import { join, resolve } from 'path';
import { copy } from 'fs-extra';
import { generateSW } from 'workbox-build';
import { config } from './scripts/vite.config.mjs';
import { __DEV__ } from './scripts/utils.mjs';

const r = (...path) => resolve(__dirname, ...path);
const hashRegExp = /-[0-9a-fA-F]{8}\./;

export default defineConfig(() => {
  const outDir = r('dist', 'public');

  const input = [
    r('src', 'index.html'),
    r('src', 'sandbox.html'),
    __DEV__ && r('src', 'embed.html'),
  ].filter(Boolean);

  return {
    ...config,

    root: r('src'),
    publicDir: r('public'),

    server: {
      open: __DEV__,
      proxy: {
        '/api': {
          target: 'http://localhost:8888/.netlify/functions',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, '').replace(/\.js$/, ''),
        },
        '^gist/.*': 'http://localhost:5173',
      },
    },

    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input,
        output: {
          entryFileNames: '[name].js',
        },
      },
    },

    plugins: [
      ...config.plugins,
      {
        name: 'post-build',
        async generateBundle() {
          await Promise.all([
            copy('_redirects', join(outDir, '_redirects')),
            copy('.well-known', join(outDir, '.well-known')),
          ]);

          await generateSW({
            globDirectory: 'dist/public',
            globPatterns: ['**/*.{html,js,css,png,svg,jpg,gif,json,ico}'],
            swDest: r('dist/public/sw.js'),
            clientsClaim: true,
            skipWaiting: true,
            manifestTransforms: [
              async function removeRevisionManifestTransform(manifestEntries) {
                return {
                  manifest: manifestEntries.map((entry) =>
                    hashRegExp.test(entry.url)
                      ? { ...entry, revision: null }
                      : entry,
                  ),
                };
              },
            ],
            ignoreURLParametersMatching: [/.*/],
          });
        },
      },
    ],

    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: '../tests/setupTests',
    },
  };
});
