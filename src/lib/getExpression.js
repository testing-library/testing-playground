export function escape(val) {
  return val.replace(/'/g, `\\'`);
}

export function getFieldName(method) {
  return method[5].toLowerCase() + method.substr(6);
}

export function getExpression({ method, data }) {
  const field = getFieldName(method);

  if (method === 'getByRole' && data.role && data.name) {
    return `screen.getByRole('${data.role}', { name: '${escape(data.name)}' })`;
  }

  if (data[field]) {
    return `screen.${method}('${escape(data[field])}')`;
  }

  return '';
}

export default getExpression;
