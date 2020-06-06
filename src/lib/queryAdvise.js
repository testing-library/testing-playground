import { messages, queries } from '../constants';
import { getExpression } from './getExpression';
import { computeAccessibleName, getRole } from 'dom-accessibility-api';

export function getData({ rootNode, element }) {
  const type = element.getAttribute('type');
  const tagName = element.tagName;

  // escape id to prevent querySelector from tripping over corrupted html like:
  //   <input id="button\n<button> & <input id=\ntype="text" />
  const id = (element.getAttribute('id') || '')
    .replace(/\s/g, '')
    .replace(/"/g, '\\"');

  const labelElem = id ? rootNode.querySelector(`[for="${id}"]`) : null;
  const labelText = labelElem ? labelElem.innerText : null;

  return {
    role: element.getAttribute('aria-hidden')
      ? undefined
      : element.getAttribute('role') ||
        // input's require a type for the role
        (tagName === 'INPUT' && type !== 'text' ? '' : getRole(element)),
    name: computeAccessibleName(element),
    tagName: tagName,
    type: type,
    labelText: labelText,
    placeholderText: element.getAttribute('placeholder'),
    text: element.innerText,
    displayValue: element.getAttribute('value'),

    altText: element.getAttribute('alt'),
    title: element.getAttribute('title'),

    testId: element.getAttribute('data-testid'),
  };
}

export function getQueryAdvise({ rootNode, element }) {
  if (!rootNode || element?.nodeType !== Node.ELEMENT_NODE) {
    return { data: {}, suggestion: {} };
  }

  const data = getData({ rootNode, element });
  const query = queries.find(({ method }) => getExpression({ method, data }));

  if (!query) {
    return {
      level: 3,
      expression: 'container.querySelector(…)',
      suggestion: {},
      data,
      ...messages[3],
    };
  }

  const expression = getExpression({ method: query.method, data });
  const suggestion = { expression, ...query, ...messages[query.level] };

  return {
    data,
    suggestion,
  };
}
