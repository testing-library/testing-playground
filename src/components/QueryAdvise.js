import React from 'react';
import { messages, queries } from '../constants';
import { useAppContext } from './Context';
import { getExpression } from '../lib';

const colors = ['bg-blue-600', 'bg-yellow-600', 'bg-orange-600', 'bg-red-600'];

function getQueryAdvise(data) {
  const query = queries.find(({ method }) => getExpression({ method, data }));
  if (!query) {
    return {
      level: 3,
      expression: 'container.querySelector(…)',
      ...messages[3],
    };
  }
  const expression = getExpression({ method: query.method, data });
  return { expression, ...query, ...messages[query.level] };
}

function Code({ children }) {
  return <span className="font-bold font-mono">{children}</span>;
}

function Quote({ heading, content, source, href }) {
  return (
    <blockquote className="text-sm mb-4 italic w-full">
      <p className="font-bold text-xs mb-2">{heading}:</p>
      <p>{content}</p>
      <cite>
        <a href={href}>{source}</a>
      </cite>
    </blockquote>
  );
}

function QueryAdvise({ data, advise }) {
  const { parsed, jsEditorRef } = useAppContext();

  const used = parsed?.expression || {};
  const hasError = !!parsed?.error;

  const usingAdvisedMethod = advise.method === used.method;
  const hasNameArg = data.name && used.args?.[1]?.includes('name');

  const color = hasError
    ? 'bg-red-600'
    : usingAdvisedMethod
    ? 'bg-green-600'
    : colors[advise.level];

  const target = parsed.target || {};

  const title = hasError ? 'error!' : 'suggested query';
  let suggestion;

  if (hasError) {
    suggestion = <></>;
  } else if (advise.level < used.level) {
    suggestion = (
      <p>
        You're using <Code>{used.method}</Code>, which falls under{' '}
        <Code>{messages[used.level].heading}</Code>. Upgrading to{' '}
        <Code>{advise.method}</Code> is recommended.
      </p>
    );
  } else if (advise.level === 0 && advise.method !== used.method) {
    suggestion = (
      <p>
        Nice! <Code>{used.method}</Code> is a great selector! Using{' '}
        <Code>{advise.method}</Code> would still be preferable though.
      </p>
    );
  } else if (target.tagName === 'INPUT' && !target.getAttribute('type')) {
    suggestion = (
      <p>
        You can unlock <Code>getByRole</Code> by adding the{' '}
        <Code>type="text"</Code> attribute explicitly. Accessibility will
        benefit from it.
      </p>
    );
  } else if (
    advise.level === 0 &&
    advise.method === 'getByRole' &&
    !data.name
  ) {
    suggestion = (
      <p>
        Awesome! This is great already! You could still make the query a bit
        more specific by adding the name option. This would require to add some
        markup though, as your element isn't named properly.
      </p>
    );
  } else if (
    advise.level === 0 &&
    advise.method === 'getByRole' &&
    data.name &&
    !hasNameArg
  ) {
    suggestion = (
      <p>
        There is one thing though. You could make the query a bit more specific
        by adding the name option.
      </p>
    );
  } else if (used.level > 0) {
    suggestion = (
      <p>
        This isn't great, but we can't do better with the current markup. Extend
        your html to improve accessibility and unlock better queries.
      </p>
    );
  } else {
    suggestion = <p>This is great. Ship it!</p>;
  }

  const handleClick = () => {
    jsEditorRef.current.setValue(advise.expression);
  };

  return (
    <div className="space-y-4 text-sm">
      <div className={['text-white p-4 rounded space-y-2', color].join(' ')}>
        <div className="font-bold text-xs">{title}</div>
        {advise.expression && (
          <div
            className="font-mono cursor-pointer text-xs"
            onClick={handleClick}
          >
            &gt; {advise.expression}
          </div>
        )}
        {parsed.error && (
          <div className="font-mono cursor-pointer text-xs">
            &gt; {parsed.error}
          </div>
        )}
      </div>
      <div className="min-h-8">{suggestion}</div>
    </div>
  );
}

export default QueryAdvise;
