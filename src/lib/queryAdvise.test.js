import { getAllPossibleQueries } from './queryAdvise';

it('[getAllPossibleQueries] should return an object with all possibile queries', () => {
  const rootNode = document.createElement('div');
  const element = document.createElement('button');
  rootNode.appendChild(element);
  let suggestedQueries = getAllPossibleQueries({ rootNode, element });

  expect(suggestedQueries).toMatchInlineSnapshot(`
    Object {
      "AltText": undefined,
      "DisplayValue": undefined,
      "LabelText": undefined,
      "PlaceholderText": undefined,
      "Role": Object {
        "excerpt": "getByRole('button')",
        "queryArgs": Array [
          "button",
        ],
        "queryMethod": "getByRole",
        "queryName": "Role",
        "snippet": "screen.getByRole('button')",
        "variant": "get",
      },
      "Selector": Object {
        "excerpt": "querySelector('div > button')",
        "queryArgs": Array [
          "div > button",
        ],
        "queryMethod": "querySelector",
        "queryName": "Selector",
        "snapshot": "screen.getByRole('button');",
        "snippet": "container.querySelector('div > button')",
      },
      "TestId": undefined,
      "Text": undefined,
      "Title": undefined,
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
  suggestedQueries = getAllPossibleQueries({ rootNode, element: input });

  expect(suggestedQueries).toMatchInlineSnapshot(`
    Object {
      "AltText": Object {
        "excerpt": "getByAltText(/enter your username/i)",
        "queryArgs": Array [
          /enter your username/i,
        ],
        "queryMethod": "getByAltText",
        "queryName": "AltText",
        "snippet": "screen.getByAltText(/enter your username/i)",
        "variant": "get",
      },
      "DisplayValue": Object {
        "excerpt": "getByDisplayValue(/john-doe/i)",
        "queryArgs": Array [
          /john-doe/i,
        ],
        "queryMethod": "getByDisplayValue",
        "queryName": "DisplayValue",
        "snippet": "screen.getByDisplayValue(/john-doe/i)",
        "variant": "get",
      },
      "LabelText": Object {
        "excerpt": "getByLabelText(/username/i)",
        "queryArgs": Array [
          /username/i,
        ],
        "queryMethod": "getByLabelText",
        "queryName": "LabelText",
        "snippet": "screen.getByLabelText(/username/i)",
        "variant": "get",
      },
      "PlaceholderText": Object {
        "excerpt": "getByPlaceholderText(/how should i call you?/i)",
        "queryArgs": Array [
          /how should i call you\\?/i,
        ],
        "queryMethod": "getByPlaceholderText",
        "queryName": "PlaceholderText",
        "snippet": "screen.getByPlaceholderText(/how should i call you?/i)",
        "variant": "get",
      },
      "Role": Object {
        "excerpt": "getByRole('textbox', { name: /username/i })",
        "queryArgs": Array [
          "textbox",
          Object {
            "name": /username/i,
          },
        ],
        "queryMethod": "getByRole",
        "queryName": "Role",
        "snippet": "screen.getByRole('textbox', {
      name: /username/i
    })",
        "variant": "get",
      },
      "Selector": Object {
        "excerpt": "querySelector('#username')",
        "queryArgs": Array [
          "#username",
        ],
        "queryMethod": "querySelector",
        "queryName": "Selector",
        "snapshot": "screen.getByRole('textbox', { name: /username/i });",
        "snippet": "container.querySelector('#username')",
      },
      "TestId": Object {
        "excerpt": "getByTestId('uname')",
        "queryArgs": Array [
          "uname",
        ],
        "queryMethod": "getByTestId",
        "queryName": "TestId",
        "snippet": "screen.getByTestId('uname')",
        "variant": "get",
      },
      "Text": undefined,
      "Title": Object {
        "excerpt": "getByTitle(/enter your username/i)",
        "queryArgs": Array [
          /enter your username/i,
        ],
        "queryMethod": "getByTitle",
        "queryName": "Title",
        "snippet": "screen.getByTitle(/enter your username/i)",
        "variant": "get",
      },
    }
  `);
});
