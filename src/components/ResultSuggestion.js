import React from 'react';
import { messages } from '../constants';
import ResultCopyButton from './ResultCopyButton';

const colors = ['bg-blue-600', 'bg-yellow-600', 'bg-orange-600', 'bg-red-600'];

function Code({ children }) {
  return <span className="font-bold font-mono">{children}</span>;
}

function ResultSuggestion({ data, suggestion, result, dispatch }) {
  const used = result?.expression || {};

  const usingAdvisedMethod = suggestion.method === used.method;
  const hasNameArg = data.name && used.args?.[1]?.includes('name');

  const color = usingAdvisedMethod ? 'bg-green-600' : colors[suggestion.level];

  const target = result?.target || {};

  let message;

  if (suggestion.level < used.level) {
    message = (
      <p>
        You&apos;re using <Code>{used.method}</Code>, which falls under{' '}
        <Code>{messages[used.level].heading}</Code>. Upgrading to{' '}
        <Code>{suggestion.method}</Code> is recommended.
      </p>
    );
  } else if (suggestion.level === 0 && suggestion.method !== used.method) {
    message = (
      <p>
        Nice! <Code>{used.method}</Code> is a great selector! Using{' '}
        <Code>{suggestion.method}</Code> would still be preferable though.
      </p>
    );
  } else if (target.tagName === 'INPUT' && !target.getAttribute('type')) {
    message = (
      <p>
        You can unlock <Code>getByRole</Code> by adding the{' '}
        <Code>type=&quot;text&quot;</Code> attribute explicitly. Accessibility
        will benefit from it.
      </p>
    );
  } else if (
    suggestion.level === 0 &&
    suggestion.method === 'getByRole' &&
    !data.name
  ) {
    message = (
      <p>
        Awesome! This is great already! You could still make the query a bit
        more specific by adding the name option. This would require to add some
        markup though, as your element isn&apos;t named properly.
      </p>
    );
  } else if (
    suggestion.level === 0 &&
    suggestion.method === 'getByRole' &&
    data.name &&
    !hasNameArg
  ) {
    message = (
      <p>
        There is one thing though. You could make the query a bit more specific
        by adding the name option.
      </p>
    );
  } else if (used.level > 0) {
    message = (
      <p>
        This isn&apos;t great, but we can&apos;t do better with the current
        markup. Extend your html to improve accessibility and unlock better
        queries.
      </p>
    );
  } else {
    message = <p>This is great. Ship it!</p>;
  }

  return (
    <div className="space-y-4 text-sm">
      <div className={['text-white p-4 rounded space-y-2', color].join(' ')}>
        <div className="font-bold text-xs">suggested query</div>
        {suggestion.expression && (
          <div className="flex justify-between">
            <div
              className="font-mono cursor-pointer text-xs"
              onClick={() => {
                return dispatch({
                  type: 'SET_QUERY',
                  query: suggestion.expression,
                });
              }}
            >
              &gt; {suggestion.expression}
              <br />
            </div>
            <ResultCopyButton expression={suggestion.expression} />
          </div>
        )}
      </div>
      <div className="min-h-8">{message}</div>
    </div>
  );
}

export default ResultSuggestion;
