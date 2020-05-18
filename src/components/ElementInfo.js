import React from 'react';
import { getRole, computeAccessibleName } from 'dom-accessibility-api';
import { messages } from '../constants';

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
    return `getByRole('${data.role}', { name: '${data.name}' })`;
  }

  if (data[field]) {
    return `${method}('${data[field]}')`;
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

function Row({ method, data }) {
  const field = getFieldName(method);
  const value = data[field];

  return (
    <tr>
      <td className="px-4 text-xs">{field}</td>
      <td className="px-4 text-xs">{value}</td>
    </tr>
  );
}

function Section({ children }) {
  return (
    <tr>
      <td colSpan="2" className="pt-4 text-xs">
        <strong>{children}</strong>
      </td>
    </tr>
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
  const expression = `screen.${getExpression({ method: query.method, data })}`;
  return { expression, level: query.level, ...messages[query.level] };
}

// for inputs, the role will only work if there is also a type attribute
function ElementInfo({ root, element }) {
  const data = getData({ root, element });
  const advise = getQueryAdvise(data);

  return (
    <div>
      <div
        className={['border text-white p-4 rounded', colors[advise.level]].join(
          ' ',
        )}
      >
        <div className="font-bold text-xs mb-2">suggested query:</div>
        {advise.expression && (
          <div className="font-mono text-sm">&gt; {advise.expression}</div>
        )}
        {/*<div className="font-bold text-xs mb-2">{advise.heading}:</div>*/}
        {/*{advise.description && <div className="text-sm mb-4">{advise.description}</div>}*/}
      </div>

      <table className="table-auto text-sm w-full">
        <tbody>
          <Section>Queries Accessible to Everyone</Section>
          <Row method="getByRole" data={data} />
          <Row method="getByLabelText" data={data} />
          <Row method="getByPlaceholderText" data={data} />
          <Row method="getByText" data={data} />
          <Row method="getByDisplayValue" data={data} />

          <Section>Semantic Queries</Section>
          <Row method="getByAltText" data={data} />
          <Row method="getByTitle" data={data} />

          <Section>TestId</Section>
          <Row method="getByTestId" data={data} />
        </tbody>
      </table>
    </div>
  );
}

export default ElementInfo;
