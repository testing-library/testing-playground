import React from 'react';
import { messages as queryGroups } from '../constants';

function Section({ children }) {
  return <div className="space-y-3">{children}</div>;
}

function Heading({ children }) {
  return <h3 className="text-xs font-bold">{children}</h3>;
}

const Field = React.memo(function Field({ method, query, dispatch, active }) {
  const arg = query?.queryArgs[0] || '';
  const value = arg.source || arg.$regexp || arg;

  const handleClick = value
    ? () => {
        dispatch({
          type: 'SET_QUERY',
          query: query.snippet,
        });
      }
    : undefined;

  return (
    <div
      className={`text-xs field ${active ? 'active' : ''}`}
      data-clickable={!!handleClick}
      onClick={handleClick}
    >
      <div className="font-light text-gray-800">{method}</div>
      <div className="truncate">
        {value || <span className="text-gray-400">n/a</span>}
      </div>
    </div>
  );
});

function QueryGroup({ group, queries, heading, activeMethod, dispatch }) {
  return (
    <Section key={group.type}>
      <Heading>{heading}</Heading>
      {group.queries.map((queryMethod) => (
        <Field
          key={queryMethod}
          method={queryMethod.replace('getBy', '')}
          query={queries[queryMethod.replace('getBy', '')]}
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
