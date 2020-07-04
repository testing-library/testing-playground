import React from 'react';
import { getFieldName } from '../lib';
import { messages as queryGroups } from '../constants';

function Section({ children }) {
  return <div className="space-y-3">{children}</div>;
}

function Heading({ children }) {
  return <h3 className="text-xs font-bold">{children}</h3>;
}

// The reviver parses serialized regexes back to a real regexp.
// This function is required if the data comes in via message transport
// think of the chrome-extension.
function reviver(obj) {
  if (typeof obj?.$regexp === 'string') {
    return new RegExp(obj.$regexp, obj.$flags);
  }

  return obj;
}

// we use our own stringify method instead of the one from @testing-library/dom,
// because it might have been removed for message transport.
function suggestionToString({ queryMethod, queryArgs } = {}) {
  if (!queryMethod || !queryArgs) {
    return '';
  }

  let [text, options] = queryArgs;

  text = typeof text === 'string' ? `'${text}'` : reviver(text);

  options = options
    ? `, { ${Object.entries(options)
        .map(([k, v]) => `${k}: ${reviver(v)}`)
        .join(', ')} }`
    : '';

  return `${queryMethod}(${text}${options})`;
}

const Field = React.memo(function Field({
  data,
  method,
  query,
  dispatch,
  active,
}) {
  const field = getFieldName(method);
  const value = data[field];

  const handleClick = value
    ? () => {
        dispatch({
          type: 'SET_QUERY',
          query: `screen.${suggestionToString(query)}`,
        });
      }
    : undefined;

  return (
    <div
      className={`text-xs field ${active ? 'active' : ''}`}
      data-clickable={!!handleClick}
      onClick={handleClick}
    >
      <div className="font-light text-gray-800">{field}</div>
      <div className="truncate">
        {value || <span className="text-gray-400">n/a</span>}
      </div>
    </div>
  );
});

function QueryGroup({ group, queries, heading, activeMethod, dispatch, data }) {
  return (
    <Section key={group.type}>
      <Heading>{heading}</Heading>
      {group.queries.map((queryMethod) => (
        <Field
          key={queryMethod}
          data={data}
          method={queryMethod}
          query={queries[queryMethod]}
          dispatch={dispatch}
          active={queryMethod === activeMethod}
        />
      ))}
    </Section>
  );
}
// for inputs, the role will only work if there is also a type attribute
function ResultQueries(props) {
  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <QueryGroup
        heading={`1. ${queryGroups[0].heading}`}
        group={queryGroups[0]}
        {...props}
      />
      <div className="space-y-8">
        <QueryGroup
          heading={`2. ${queryGroups[1].heading}`}
          group={queryGroups[1]}
          {...props}
        />
        <QueryGroup
          heading={`3. ${queryGroups[2].heading}`}
          group={queryGroups[2]}
          {...props}
        />
      </div>
    </div>
  );
}

export default React.memo(ResultQueries);
