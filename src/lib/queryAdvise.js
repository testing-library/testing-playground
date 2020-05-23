import { messages, queries } from '../constants';
import { getExpression } from './getExpression';
import { computeAccessibleName, getRole } from 'dom-accessibility-api';

export function getData({ root, element }) {
  const type = element.getAttribute('type');
  const tagName = element.tagName;

  // prevent querySelector from tripping over corrupted html like <input id="button\n<button>
  const id = (element.getAttribute('id') || '').split('\n')[0];
  const labelElem = id ? root.querySelector(`[for="${id}"]`) : null;
  const labelText = labelElem ? labelElem.innerText : null;

  return {
    role:
      element.getAttribute('role') ||
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

export function getQueryAdvise({ root, element }) {
  if (!root || element?.nodeType !== Node.ELEMENT_NODE) {
    return { data: {}, advise: {} };
  }

  const data = getData({ root, element });
  const query = queries.find(({ method }) => getExpression({ method, data }));

  if (!query) {
    return {
      level: 3,
      expression: 'container.querySelector(…)',
      advise: {},
      data,
      ...messages[3],
    };
  }

  const expression = getExpression({ method: query.method, data });
  const advise = { expression, ...query, ...messages[query.level] };

  return {
    data,
    advise,
  };
}
