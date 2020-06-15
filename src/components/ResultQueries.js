import React from 'react';
import { getFieldName } from '../lib';

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
function ResultQueries({ data, queries, dispatch, activeMethod }) {
  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <Section>
        <Heading>1. Queries Accessible to Everyone</Heading>
        <Field
          data={data}
          method="getByRole"
          query={queries['getByRole']}
          dispatch={dispatch}
          active={'getByRole' === activeMethod}
        />
        <Field
          data={data}
          method="getByLabelText"
          query={queries['getByLabelText']}
          dispatch={dispatch}
          active={'getByLabelText' === activeMethod}
        />
        <Field
          data={data}
          method="getByPlaceholderText"
          query={queries['getByPlaceholderText']}
          dispatch={dispatch}
          active={'getByPlaceholderText' === activeMethod}
        />
        <Field
          data={data}
          method="getByText"
          query={queries['getByText']}
          dispatch={dispatch}
          active={'getByText' === activeMethod}
        />
        <Field
          data={data}
          method="getByDisplayValue"
          query={queries['getByDisplayValue']}
          dispatch={dispatch}
          active={'getByDisplayValue' === activeMethod}
        />
      </Section>

      <div className="space-y-8">
        <Section>
          <Heading>2. Semantic Queries</Heading>
          <Field
            data={data}
            method="getByAltText"
            query={queries['getByAltText']}
            dispatch={dispatch}
            active={'getByAltText' === activeMethod}
          />
          <Field
            data={data}
            method="getByTitle"
            query={queries['getByTitle']}
            dispatch={dispatch}
            active={'getByTitle' === activeMethod}
          />
        </Section>

        <Section>
          <Heading>3. TestId</Heading>
          <Field
            data={data}
            method="getByTestId"
            query={queries['getByTestId']}
            dispatch={dispatch}
            active={'getByTestId' === activeMethod}
          />
        </Section>
      </div>
    </div>
  );
}

export default React.memo(ResultQueries);
