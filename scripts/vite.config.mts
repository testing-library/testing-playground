import { InlineConfig } from "vite";
import { __DEV__, resolve as r } from "./utils.mjs";
import * as fs from "fs-extra";
import react from "@vitejs/plugin-react";
import * as packageJson from '../package.json';

export const config: InlineConfig = {
  envDir: r(),
  resolve: {
    alias: {
      '~': r(),
      events: 'rollup-plugin-node-polyfills/polyfills/events',
    },
  },
  define: {
    '__DEV__': __DEV__,
    '__NAME__': JSON.stringify(packageJson.name),
    'process.env.NODE_ENV': JSON.stringify(__DEV__ ? 'development' : 'production'),
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
}
