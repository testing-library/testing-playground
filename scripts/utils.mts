import { fileURLToPath } from "url";
import * as path from "path";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const repoRoot = path.resolve(__dirname, '..');

export const __DEV__ = process.env.NODE_ENV === 'development';

export const resolve = (...p) => {
  const segments = p.flatMap(p => p.replace(repoRoot, '').split('/'))
  return path.resolve(repoRoot, ...segments.filter(Boolean));
}
