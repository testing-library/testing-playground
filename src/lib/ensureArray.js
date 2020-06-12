export function ensureArray(collection) {
  return collection instanceof NodeList
    ? Array.from(collection)
    : Array.isArray(collection)
    ? collection
    : [collection];
}
