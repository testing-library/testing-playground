import React from 'react';
import { getExpression, getFieldName } from '../lib';

function Section({ children }) {
  return <div className="space-y-3">{children}</div>;
}

function Heading({ children }) {
  return <h3 className="font-bold text-xs">{children}</h3>;
}

function Field({ method, data, dispatch, active }) {
  const field = getFieldName(method);
  const value = data[field];

  const handleClick = value
    ? () => {
        const expression = getExpression({ method, data });
        dispatch({ type: 'SET_QUERY', query: expression });
      }
    : undefined;

  return (
    <div
      className={`text-xs field ${active ? 'active' : ''}`}
      data-clickable={!!handleClick}
      onClick={handleClick}
    >
      <div className="text-gray-800 font-light">{field}</div>
      <div className="truncate">
        {value || <span className="text-gray-400">n/a</span>}
      </div>
    </div>
  );
}

// for inputs, the role will only work if there is also a type attribute
function ResultQueries({ data, dispatch, activeMethod }) {
  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <Section>
        <Heading>1. Queries Accessible to Everyone</Heading>
        <Field
          method="getByRole"
          data={data}
          dispatch={dispatch}
          active={'getByRole' === activeMethod}
        />
        <Field
          method="getByLabelText"
          data={data}
          dispatch={dispatch}
          active={'getByLabelText' === activeMethod}
        />
        <Field
          method="getByPlaceholderText"
          data={data}
          dispatch={dispatch}
          active={'getByPlaceholderText' === activeMethod}
        />
        <Field
          method="getByText"
          data={data}
          dispatch={dispatch}
          active={'getByText' === activeMethod}
        />
        <Field
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
            method="getByAltText"
            data={data}
            dispatch={dispatch}
            active={'getByAltText' === activeMethod}
          />
          <Field
            method="getByTitle"
            data={data}
            dispatch={dispatch}
            active={'getByTitle' === activeMethod}
          />
        </Section>

        <Section>
          <Heading>3. TestId</Heading>
          <Field
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

export default ResultQueries;
