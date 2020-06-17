import { getQueryAdvise, getAllPossibileQueries } from './queryAdvise';

const emptyObject = `
  Object {
    "data": Object {},
    "suggestion": Object {},
  }
`;

it('should return default suggested query if none was returned by dtl', () => {
  const rootNode = document.createElement('div');
  const element = document.createElement('faketag');
  const result = getQueryAdvise({ rootNode, element });
  expect(result.suggestion.expression).toEqual(
    "container.querySelector('faketag')",
  );
});

it('should return an empty object if root node is a malformed object', () => {
  const element = document.createElement('faketag');

  let result = getQueryAdvise({ rootNode: null, element });
  expect(result).toMatchInlineSnapshot(emptyObject);

  result = getQueryAdvise({ rootNode: '', element });
  expect(result).toMatchInlineSnapshot(emptyObject);

  result = getQueryAdvise({ rootNode: {}, element });
  expect(result).toMatchInlineSnapshot(emptyObject);
});

it('should return an empty object if element node is a malformed object', () => {
  const rootNode = document.createElement('div');

  let result = getQueryAdvise({ rootNode, element: null });
  expect(result).toMatchInlineSnapshot(emptyObject);

  result = getQueryAdvise({ rootNode, element: '' });
  expect(result).toMatchInlineSnapshot(emptyObject);

  result = getQueryAdvise({ rootNode, element: {} });
  expect(result).toMatchInlineSnapshot(emptyObject);
});

it('should add `screen.` on suggested query returned by getSuggestedQuery', () => {
  const rootNode = document.createElement('div');
  const element = document.createElement('button');
  const result = getQueryAdvise({ rootNode, element });
  expect(result.suggestion.expression).toStartWith('screen.');
});

it('[getAllPossibileQueries] should return an object with all possibile queries', () => {
  const rootNode = document.createElement('div');
  const element = document.createElement('button');
  rootNode.appendChild(element);
  let suggestedQueries = getAllPossibileQueries(element);

  expect(suggestedQueries).toMatchInlineSnapshot(`
    Object {
      "getByRole": Object {
        "queryArgs": Array [
          "button",
        ],
        "queryMethod": "getByRole",
        "queryName": "Role",
        "toString": [Function],
        "variant": "get",
      },
    }
  `);

  rootNode.innerHTML = `
    <label for="username">Username</label>
    <input 
      id="username"
      name="username"
      placeholder="how should I call you?" 
      data-testid="uname"
      title="enter your username"
      alt="enter your username"
      value="john-doe"
      type="text"
    />
  `;
  const input = rootNode.querySelector('input');
  suggestedQueries = getAllPossibileQueries(input);

  expect(suggestedQueries).toMatchInlineSnapshot(`
    Object {
      "getByAltText": Object {
        "queryArgs": Array [
          /enter your username/i,
        ],
        "queryMethod": "getByAltText",
        "queryName": "AltText",
        "toString": [Function],
        "variant": "get",
      },
      "getByDisplayValue": Object {
        "queryArgs": Array [
          /john-doe/i,
        ],
        "queryMethod": "getByDisplayValue",
        "queryName": "DisplayValue",
        "toString": [Function],
        "variant": "get",
      },
      "getByLabelText": Object {
        "queryArgs": Array [
          /username/i,
        ],
        "queryMethod": "getByLabelText",
        "queryName": "LabelText",
        "toString": [Function],
        "variant": "get",
      },
      "getByPlaceholderText": Object {
        "queryArgs": Array [
          /how should i call you\\?/i,
        ],
        "queryMethod": "getByPlaceholderText",
        "queryName": "PlaceholderText",
        "toString": [Function],
        "variant": "get",
      },
      "getByRole": Object {
        "queryArgs": Array [
          "textbox",
          Object {
            "name": /username/i,
          },
        ],
        "queryMethod": "getByRole",
        "queryName": "Role",
        "toString": [Function],
        "variant": "get",
      },
      "getByTestId": Object {
        "queryArgs": Array [
          "uname",
        ],
        "queryMethod": "getByTestId",
        "queryName": "TestId",
        "toString": [Function],
        "variant": "get",
      },
      "getByTitle": Object {
        "queryArgs": Array [
          /enter your username/i,
        ],
        "queryMethod": "getByTitle",
        "queryName": "Title",
        "toString": [Function],
        "variant": "get",
      },
    }
  `);
});
