import prettyFormat from 'pretty-format';
import { ensureArray } from './lib';
import { queries as supportedQueries } from './constants';

// this is not the way I want it to be, but I can't get '@testing-library/dom'
// to build with Parcel. Something with "Incompatible receiver, Map required".
// It works when running parcel in dev mode, but not in build mode. Seems to
// have something to do with a core-js Map polyfill being used?
// It's now loaded from unpkg.com via ./index.html
//import { getQueriesForElement, queries, logDOM } from '@testing-library/dom';
const {
  getQueriesForElement,
  queries,
  getRoles,
  logDOM,
} = window.TestingLibraryDom;

const debug = (element, maxLength, options) =>
  Array.isArray(element)
    ? element.map((el) => logDOM(el, maxLength, options)).join('\n')
    : logDOM(element, maxLength, options);

function getScreen(root) {
  return getQueriesForElement(root, queries, { debug });
}

function scopedEval(context, expr) {
  const evaluator = Function.apply(null, [
    ...Object.keys(context),
    'expr',
    'return eval(expr)',
  ]);

  return evaluator.apply(null, [...Object.values(context), expr.trim()]);
}

function unQuote(string = '') {
  // first and last char of a quoted string should be the same
  if (string[0] !== string[string.length - 1]) {
    return string;
  }

  // I only know of 3 valid quote chars, ` ' and "
  if (string[0] === `'` || string[0] === `"` || string[0] === '`') {
    return string.substr(1, string.length - 2);
  }

  // return as is, if string wasn't (properly) quoted
  return string;
}

function getLastExpression(code) {
  const minified = (code || '')
    // remove comments
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
    // remove all white space outside quotes
    .replace(/[ ]+(?=[^"'`]*(?:["'`][^"'`]*["'`][^"'`]*)*$)/g, '');

  const start = supportedQueries.reduce(
    (idx, qry) => Math.max(idx, minified.lastIndexOf(qry.method)),
    -1,
  );

  if (start === -1) {
    return '';
  }

  const end = minified.indexOf(')', start);
  const call = minified
    .substr(start, end - start + 1)
    // add back some spaces that were removed previously
    .replace(/{/g, '{ ')
    .replace(/}/g, ' }')
    .replace(/:/g, ': ')
    .replace(/,/g, ', ');

  // call now holds something like getByRole('button'), but we also want to know
  // if the user was calling the method on screen, view, or container
  const leading = minified.substr(0, start);
  let scope = leading.match(/([a-zA-Z_$][0-9a-zA-Z_$]+)\.$/)?.[1] || '';

  // and let's break up the various parts (['getByRole', 'button', '{ name: `input` }'])
  const [method, ...args] = call
    .split(/[(),]/)
    .filter(Boolean)
    .map((x) => unQuote(x.trim()));

  const expression = [scope, call].filter(Boolean).join('.');
  const level = supportedQueries.find((x) => x.method === method)?.level ?? 3;

  return {
    expression,
    scope,
    method,
    level,
    args,
    call,
  };
}

let id = 0;

function parse({ htmlRoot, js }) {
  let result = {
    // increment the id every time we call parse, so we can use
    // it for react keys, when iterating over targets
    id: ++id,
  };

  try {
    const context = Object.assign({}, queries, {
      screen: getScreen(htmlRoot),
      container: htmlRoot,
    });

    result.code = scopedEval(context, js);
  } catch (e) {
    result.error = e.message.split('\n')[0];
    result.errorBody = e.message.split('\n').slice(1).join('\n').trim();
  }

  result.targets = ensureArray(result.code).filter(
    (x) => x?.nodeType === Node.ELEMENT_NODE,
  );

  result.target = result.targets[0];

  result.expression = getLastExpression(js);
  result.text = prettyFormat(result.code, {
    plugins: [
      prettyFormat.plugins.DOMElement,
      prettyFormat.plugins.DOMCollection,
    ],
  });

  result.roles = getRoles(htmlRoot);

  return result;
}

export default {
  parse,
};
