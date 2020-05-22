export function ensureArray(collection) {
  return Array.isArray(collection) ? collection : [collection];
}
