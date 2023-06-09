import { InlineConfig } from 'vite';
import { resolve as r } from './utils.mjs';
import * as fs from 'fs-extra';
import react from '@vitejs/plugin-react';

export const config: InlineConfig = {
  envDir: r(),
  resolve: {
    alias: {
      '~': r(),
      events: 'rollup-plugin-node-polyfills/polyfills/events',
    },
  },
  esbuild: { loader: 'jsx', include: /src\/.*\.jsx?$/, exclude: [] },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
              loader: 'jsx',
              contents: await fs.readFile(args.path, 'utf8'),
            }));
          },
        },
      ],
    },
  },
  plugins: [react()],
};
