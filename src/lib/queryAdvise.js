import { getSuggestedQuery, queries as queryFns } from '@testing-library/dom';
import cssPath from './cssPath';
import beautify from './beautify';

function flattenDOM(node) {
  return [
    node,
    ...Array.from(node.children).reduce(
      (acc, child) => [...acc, ...flattenDOM(child)],
      [],
    ),
  ];
}

function getSnapshot(element) {
  const innerItems = flattenDOM(element);
  const snapshot = innerItems
    .map((el) => {
      const suggestion = getSuggestedQuery(el);
      return suggestion && `screen.${suggestion.toString()};`;
    })
    .filter(Boolean)
    .join('\n');

  return snapshot;
}

function getAll(rootNode, { queryName, queryArgs }) {
  // use queryBy here, we don't want to throw on no-results-found
  return queryFns[`queryAllBy${queryName}`](rootNode, ...queryArgs);
}

function matchesSingleElement(rootNode, query) {
  return getAll(rootNode, query)?.length === 1;
}

/**
 * Check if the viewQuery only matches a single element within the rootNode
 * and if the elementQuery only matches a single element within the view
 *
 * @param rootNode HTMLElement
 * @param viewQuery QuerySuggestion
 * @param elementQuery QuerySuggestion
 * @returns {boolean}
 */
function matchesSingleElementInView(rootNode, viewQuery, elementQuery) {
  const elements = getAll(rootNode, viewQuery);

  if (elements.length !== 1) {
    return false;
  }

  return getAll(elements[0], elementQuery).length === 1;
}

function getCodeSnippet(rootNode, element, elementQuery) {
  // query the element on `screen`, if it results in a single element
  if (matchesSingleElement(rootNode, elementQuery)) {
    return beautify.js(`screen.${elementQuery}`);
  }

  // turns out, there are multiple matches. We're going to try to scope
  // the query by using the `within` helper method.
  let node = element;
  while (node && node !== rootNode) {
    const view = getSuggestedQuery(node, 'get');

    if (view && matchesSingleElementInView(rootNode, view, elementQuery)) {
      const prop = view.queryName === 'Role' ? view.queryArgs[0] : 'view';
      return beautify.js(`
        const ${prop} = screen.${view};
        
        within(${prop}).${elementQuery};
      `);
    }

    node = node.parentNode;
  }

  // can't construct a working query? :/
  return '// sorry, I failed to provide something useful';
}

const queryMethods = [
  'Role',
  'LabelText',
  'PlaceholderText',
  'Text',
  'DisplayValue',
  'AltText',
  'Title',
  'TestId',
];

export function getAllPossibleQueries({ rootNode, element }) {
  const result = {};

  for (const method of queryMethods) {
    let suggestion = getSuggestedQuery(element, 'get', method);

    if (suggestion) {
      suggestion.snippet = getCodeSnippet(rootNode, element, suggestion);
      suggestion.excerpt = suggestion.toString();

      // toString can't be serialized for message transport
      delete suggestion.toString;
    }

    result[method] = suggestion;
  }

  const path = cssPath(element, true).toString();
  result.Selector = {
    queryMethod: 'querySelector',
    queryName: 'Selector',
    queryArgs: [path],
    snippet: `container.querySelector('${path}')`,
    excerpt: `querySelector('${path}')`,
    snapshot: getSnapshot(element),
  };

  return result;
}
