import React from 'react';
import { getRole, computeAccessibleName } from 'dom-accessibility-api';
import { links, messages } from '../constants';
import SetLike from 'dom-accessibility-api/dist/polyfills/SetLike';
import { useAppContext } from './Context';

const colors = ['bg-blue-600', 'bg-yellow-600', 'bg-orange-600', 'bg-red-600'];

const queries = [
  { method: 'getByRole', level: 0 },
  { method: 'getByLabelText', level: 0 },
  { method: 'getByPlaceholderText', level: 0 },
  { method: 'getByText', level: 0 },
  { method: 'getByDisplayValue', level: 0 },

  { method: 'getByAltText', level: 1 },
  { method: 'getByTitle', level: 1 },

  { method: 'getByTestId', level: 2 },

  // 'container.querySelector'
];

function getExpression({ method, data }) {
  const field = getFieldName(method);

  if (method === 'getByRole' && data.role && data.name) {
    return `screen.getByRole('${data.role}', { name: '${data.name}' })`;
  }

  if (data[field]) {
    return `screen.${method}('${data[field]}')`;
  }

  return '';
}

function getFieldName(method) {
  return method[5].toLowerCase() + method.substr(6);
}

function getData({ root, element }) {
  const type = element.getAttribute('type');
  const tagName = element.tagName;

  // prevent querySelector from tripping over corrupted html like <input id="button\n<button>
  const id = (element.getAttribute('id') || '').split('\n')[0];
  const labelElem = id ? root.querySelector(`[for="${id}"]`) : null;
  const labelText = labelElem ? labelElem.innerText : null;

  return {
    // input's require a type for the role
    role:
      element.getAttribute('role') || (tagName === 'INPUT' && !type)
        ? ''
        : getRole(element),
    name: computeAccessibleName(element),
    tagName: tagName,
    type: type,
    labelText: labelText,
    placeholderText: element.getAttribute('placeholder'),
    text: element.innerText,
    displayValue: element.getAttribute('value'),

    altText: element.getAttribute('alt'),
    title: element.getAttribute('title'),

    testId: element.getAttribute('data-testid'),
  };
}

function Section({ children }) {
  return <div className="space-y-3">{children}</div>;
}

function Heading({ children }) {
  return <h3 className="font-bold text-xs">{children}</h3>;
}

function Field({ method, data }) {
  const { jsEditorRef } = useAppContext();

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
      className="text-xs field"
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
  return { expression, level: query.level, ...messages[query.level] };
}

// for inputs, the role will only work if there is also a type attribute
function ElementInfo({ element }) {
  const { htmlPreviewRef } = useAppContext();
  const data = getData({ root: htmlPreviewRef.current, element });
  const advise = getQueryAdvise(data);

  return (
    <div>
      <div
        className={[
          'border text-white p-4 rounded mb-8',
          colors[advise.level],
        ].join(' ')}
      >
        <div className="font-bold text-xs mb-2">suggested query:</div>
        {advise.expression && (
          <div className="font-mono text-sm">&gt; {advise.expression}</div>
        )}
      </div>

      {/*disabled for the time being*/}
      {false && advise.description && (
        <blockquote className="text-sm mb-4 italic">
          <p className="font-bold text-xs mb-2">{advise.heading}:</p>
          <p>{advise.description}</p>
          <cite>
            <a href={links.which_query.url}>Testing Library</a>
          </cite>
        </blockquote>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Section>
          <Heading>Queries Accessible to Everyone</Heading>
          <Field method="getByRole" data={data} />
          <Field method="getByLabelText" data={data} />
          <Field method="getByPlaceholderText" data={data} />
          <Field method="getByText" data={data} />
          <Field method="getByDisplayValue" data={data} />
        </Section>

        <div className="space-y-8">
          <Section>
            <Heading>Semantic Queries</Heading>
            <Field method="getByAltText" data={data} />
            <Field method="getByTitle" data={data} />
          </Section>

          <Section>
            <Heading>TestId</Heading>
            <Field method="getByTestId" data={data} />
          </Section>
        </div>
      </div>
    </div>
  );
}

export default ElementInfo;
