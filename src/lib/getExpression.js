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

export function getExpression({ method, data }) {
  const field = getFieldName(method);

  if (method === 'getByRole' && data.role && data.name) {
    return `screen.getByRole('${data.role}', { name: ${wrapInQuotes(
      data.name,
    )} })`;
  }

  if (data[field]) {
    return `screen.${method}(${wrapInQuotes(data[field])})`;
  }

  return '';
}

export default getExpression;
