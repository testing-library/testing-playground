import prettyFormat from 'pretty-format';
import { ensureArray } from './lib';
import { queries as supportedQueries } from './constants';
import cssPath from './lib/cssPath';
import deepEqual from './lib/deepEqual';
import { getAllPossibleQueries } from './lib/queryAdvise';

import {
  getQueriesForElement,
  queries,
  getRoles,
  logDOM,
  configure as testingLibraryConfigure,
} from '@testing-library/dom';

import userEvent from '@testing-library/user-event';

// Patch RegeXP so we have a (better) way to serialize for message transport
RegExp.prototype.toJSON = function () {
  return { $regexp: this.source, $flags: this.flags };
};

const debug = (element, maxLength, options) =>
  Array.isArray(element)
    ? element.map((el) => logDOM(el, maxLength, options)).join('\n')
    : logDOM(element, maxLength, options);

export function getScreen(root) {
  return getQueriesForElement(root, queries, { debug });
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
    .map((x) => unQuote((x || '').trim()));

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

function createEvaluator({ rootNode }) {
  const context = Object.assign({}, queries, {
    screen: getScreen(rootNode),
    userEvent,
    user: userEvent,
    container: rootNode,
    within: getQueriesForElement,
  });

  const evaluator = Function.apply(null, [
    ...Object.keys(context),
    'expr',
    'return eval(expr)',
  ]);

  function wrap(cb, extraData = {}) {
    let result = { ...extraData };

    try {
      result.data = cb();
    } catch (e) {
      const error = e.message.split('\n');

      result.error = {
        message: error[0],
        details: error.slice(1).join('\n').trim(),
      };
    }

    result.elements = ensureArray(result.data)
      .filter((x) => x?.nodeType === Node.ELEMENT_NODE)
      .map((element) => {
        const queries = getAllPossibleQueries({ rootNode, element });
        const suggestion = Object.values(queries).find(Boolean);

        return {
          cssPath: cssPath(element, true).toString(),
          suggestion,
          queries,
        };
      });

    result.accessibleRoles = getRoles(rootNode);
    return result;
  }

  function exec(context, expr) {
    return evaluator.apply(null, [
      ...Object.values(context),
      (expr || '').trim(),
    ]);
  }

  return { context, evaluator, exec, wrap };
}

function runUnsafe({ rootNode, query }) {
  const evaluator = createEvaluator({ rootNode });

  const result = evaluator.wrap(
    () => evaluator.exec(evaluator.context, query),
    {
      query,
      markup: rootNode.innerHTML,
    },
  );

  return result;
}

function configure({ testIdAttribute }) {
  testingLibraryConfigure({ testIdAttribute });
}

function parse({ rootNode, query, prevResult }) {
  if (!rootNode) {
    throw new Error(`rootNode should be provided`);
  }

  const result = runUnsafe({ rootNode, query });

  result.expression = getLastExpression(query);

  result.formatted = prettyFormat(result.data, {
    plugins: [
      prettyFormat.plugins.DOMElement,
      prettyFormat.plugins.DOMCollection,
    ],
  });

  if (prevResult) {
    const keys = Object.keys(result);

    for (let key of keys) {
      if (deepEqual(result[key], prevResult[key])) {
        result[key] = prevResult[key];
      }
    }

    if (keys.every((key) => result[key] === prevResult[key])) {
      return prevResult;
    }
  }

  // data holds the raw nodes, we don't want to send those out
  delete result.data;
  return result;
}

export default {
  parse,
  configure,
};
