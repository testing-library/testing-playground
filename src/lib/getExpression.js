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

  if (method === 'getByRole') {
    if (data.role && data.name) {
      const matcher = new RegExp(`${data.name}`.toLowerCase(), 'i');
      return `screen.getByRole('${data.role}', { name: ${matcher} })`;
    } else {
      return `screen.getByRole('${data.role}')`;
    }
  }

  if (data[field]) {
    const matcher = new RegExp(`${data[field]}`.toLowerCase(), 'i');
    return `screen.${method}(${matcher})`;
  }

  return '';
}

export default getExpression;
