import prettyFormat from 'pretty-format';

// this is not the way I want it to be, but I can't get '@testing-library/dom'
// to build with Parcel. Something with "Incompatible receiver, Map required".
// It works when running parcel in dev mode, but not in build mode. Seems to
// have something to do with a core-js Map polyfill being used?
// It's now loaded from unpkg.com via ./index.html
// import {getQueriesForElement, queries, logDOM} from "@testing-library/dom";
const { getQueriesForElement, queries, logDOM } = window.TestingLibraryDom;

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

function parse(root, string) {
  try {
    const context = Object.assign({}, queries, {
      screen: getScreen(root),
      container: root,
    });

    let code = scopedEval(context, string);
    return {
      code,
      text: prettyFormat(code, {
        plugins: [
          prettyFormat.plugins.DOMElement,
          prettyFormat.plugins.DOMCollection,
        ],
      }),
    };
  } catch (e) {
    return { error: e.message.split('\n')[0] };
  }
}

export default {
  parse,
};
