import React from 'react';
import { getSuggestedQuery } from '@testing-library/dom';
import { getFieldName } from '../lib';

function Section({ children }) {
  return <div className="space-y-3">{children}</div>;
}

function Heading({ children }) {
  return <h3 className="text-xs font-bold">{children}</h3>;
}

const Field = React.memo(function Field({
  method,
  data,
  dispatch,
  active,
  target,
}) {
  const field = getFieldName(method);
  const value = data[field];
  const handleClick = value
    ? () => {
        const suggestedQuery = getSuggestedQuery(
          target,
          'get',
          field.charAt(0).toUpperCase() + field.slice(1),
        );

        dispatch({
          type: 'SET_QUERY',
          query: `screen.${suggestedQuery.toString()}`,
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
function ResultQueries({ data, dispatch, activeMethod, target }) {
  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <Section>
        <Heading>1. Queries Accessible to Everyone</Heading>
        <Field
          target={target}
          method="getByRole"
          data={data}
          dispatch={dispatch}
          active={'getByRole' === activeMethod}
        />
        <Field
          target={target}
          method="getByLabelText"
          data={data}
          dispatch={dispatch}
          active={'getByLabelText' === activeMethod}
        />
        <Field
          target={target}
          method="getByPlaceholderText"
          data={data}
          dispatch={dispatch}
          active={'getByPlaceholderText' === activeMethod}
        />
        <Field
          target={target}
          method="getByText"
          data={data}
          dispatch={dispatch}
          active={'getByText' === activeMethod}
        />
        <Field
          target={target}
          method="getByDisplayValue"
          data={data}
          dispatch={dispatch}
          active={'getByDisplayValue' === activeMethod}
        />
      </Section>

      <div className="space-y-8">
        <Section>
          <Heading>2. Semantic Queries</Heading>
          <Field
            target={target}
            method="getByAltText"
            data={data}
            dispatch={dispatch}
            active={'getByAltText' === activeMethod}
          />
          <Field
            target={target}
            method="getByTitle"
            data={data}
            dispatch={dispatch}
            active={'getByTitle' === activeMethod}
          />
        </Section>

        <Section>
          <Heading>3. TestId</Heading>
          <Field
            target={target}
            method="getByTestId"
            data={data}
            dispatch={dispatch}
            active={'getByTestId' === activeMethod}
          />
        </Section>
      </div>
    </div>
  );
}

export default React.memo(ResultQueries);
