export function wrapInQuotes(val) {
  if (!val.includes(`'`)) {
    return `'${val}'`;
  }

  if (!val.includes('"')) {
    return `"${val}"`;
  }

  if (!val.includes('`')) {
    return `\`${val}\``;
  }

  return `'${val.replace(/'/g, `\\'`)}'`;
}

export function getFieldName(method) {
  return method[5].toLowerCase() + method.substr(6);
}
