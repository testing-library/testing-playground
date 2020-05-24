import React from 'react';
import { useAppContext } from './Context';
import QueryAdvise from './QueryAdvise';

import { getExpression, getFieldName, getQueryAdvise } from '../lib';

function Section({ children }) {
  return <div className="space-y-3">{children}</div>;
}

function Heading({ children }) {
  return <h3 className="font-bold text-xs">{children}</h3>;
}

function Field({ method, data }) {
  const { jsEditorRef, parsed } = useAppContext();

  const isActive = parsed.expression?.method === method;
  const field = getFieldName(method);
  const value = data[field];

  const handleClick = value
    ? () => {
        const expr = getExpression({ method, data });
        jsEditorRef.current.setValue(expr);
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
function ElementInfo() {
  const { htmlPreviewRef, parsed } = useAppContext();
  const element = parsed.target;

  const { data, advise } = getQueryAdvise({
    root: htmlPreviewRef.current,
    element,
  });

  if (!data) {
    return <div />;
  }

  return (
    <div>
      <QueryAdvise data={data} advise={advise} />

      <div className="my-6 border-b" />

      <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
}

export default ElementInfo;
