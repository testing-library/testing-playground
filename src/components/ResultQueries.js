import React from 'react';
import { usePlayground } from './Context';
import { getExpression, getFieldName } from '../lib';

function Section({ children }) {
  return <div className="space-y-3">{children}</div>;
}

function Heading({ children }) {
  return <h3 className="font-bold text-xs">{children}</h3>;
}

function Field({ method, data }) {
  const { state, dispatch } = usePlayground();

  const isActive = state.result.expression?.method === method;
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
      className={`text-xs field ${isActive ? 'active' : ''}`}
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
function ResultQueries({ data }) {
  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <Section>
        <Heading>1. Queries Accessible to Everyone</Heading>
        <Field method="getByRole" data={data} />
        <Field method="getByLabelText" data={data} />
        <Field method="getByPlaceholderText" data={data} />
        <Field method="getByText" data={data} />
        <Field method="getByDisplayValue" data={data} />
      </Section>

      <div className="space-y-8">
        <Section>
          <Heading>2. Semantic Queries</Heading>
          <Field method="getByAltText" data={data} />
          <Field method="getByTitle" data={data} />
        </Section>

        <Section>
          <Heading>3. TestId</Heading>
          <Field method="getByTestId" data={data} />
        </Section>
      </div>
    </div>
  );
}

export default ResultQueries;
