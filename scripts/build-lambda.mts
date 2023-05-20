#!/usr/bin/env -S npx tsx
import { $, fs } from 'zx';
import { resolve as r } from "./utils.mjs";

const root = r('src/lambda');
const dest = r('dist/server');

await fs.rm(dest, { recursive: true, force: true });

if (!fs.existsSync(r('dist/public/index.html'))) {
  console.log(`public not built yet, building...`);
  await $`npm run build:public`;
}

await fs.copy(root, dest);
await fs.copy(r('dist/public/index.html'), r(dest,'server/index.html'));

