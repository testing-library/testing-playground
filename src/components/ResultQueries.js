import React from 'react';
import { getFieldName } from '../lib';
import { queries } from '../constants';

function Section({ children }) {
  return <div className="space-y-3">{children}</div>;
}

function Heading({ children }) {
  return <h3 className="text-xs font-bold">{children}</h3>;
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
          query: `screen.${query.toString()}`,
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

// for inputs, the role will only work if there is also a type attribute
function ResultQueries({ data, possibleQueries, dispatch, activeMethod }) {
  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <Section>
        <Heading>1. Queries Accessible to Everyone</Heading>
        {queries
          .filter((query) => query.type === 'ACCESSIBLE')
          .map((query) => {
            return (
              <Field
                key={query.method}
                data={data}
                method={query.method}
                query={possibleQueries[query.method]}
                dispatch={dispatch}
                active={query.method === activeMethod}
              />
            );
          })}
      </Section>

      <div className="space-y-8">
        <Section>
          <Heading>2. Semantic Queries</Heading>
          {queries
            .filter((query) => query.type === 'SEMANTIC')
            .map((query) => {
              return (
                <Field
                  key={query.method}
                  data={data}
                  method={query.method}
                  query={possibleQueries[query.method]}
                  dispatch={dispatch}
                  active={query.method === activeMethod}
                />
              );
            })}
        </Section>

        <Section>
          <Heading>3. TestId</Heading>
          {queries
            .filter((query) => query.type === 'TEST')
            .map((query) => {
              return (
                <Field
                  key={query.method}
                  data={data}
                  method={query.method}
                  query={possibleQueries[query.method]}
                  dispatch={dispatch}
                  active={query.method === activeMethod}
                />
              );
            })}
        </Section>
      </div>
    </div>
  );
}

export default React.memo(ResultQueries);
