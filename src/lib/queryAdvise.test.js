import { getAllPossibleQueries } from './queryAdvise';

it('[getAllPossibleQueries] should return an object with all possibile queries', () => {
  const rootNode = document.createElement('div');
  const element = document.createElement('button');
  rootNode.appendChild(element);
  let suggestedQueries = getAllPossibleQueries({ rootNode, element });

  expect(suggestedQueries).toMatchInlineSnapshot(`
    {
      "AltText": undefined,
      "DisplayValue": undefined,
      "LabelText": undefined,
      "PlaceholderText": undefined,
      "Role": {
        "excerpt": "getByRole('button')",
        "queryArgs": [
          "button",
        ],
        "queryMethod": "getByRole",
        "queryName": "Role",
        "snippet": "screen.getByRole('button')",
        "variant": "get",
        "warning": "",
      },
      "Selector": {
        "excerpt": "querySelector('div > button')",
        "queryArgs": [
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
    {
      "AltText": {
        "excerpt": "getByAltText(/enter your username/i)",
        "queryArgs": [
          /enter your username/i,
        ],
        "queryMethod": "getByAltText",
        "queryName": "AltText",
        "snippet": "screen.getByAltText(/enter your username/i)",
        "variant": "get",
        "warning": "",
      },
      "DisplayValue": {
        "excerpt": "getByDisplayValue(/john\\\\-doe/i)",
        "queryArgs": [
          /john\\\\-doe/i,
        ],
        "queryMethod": "getByDisplayValue",
        "queryName": "DisplayValue",
        "snippet": "screen.getByDisplayValue(/john\\\\-doe/i)",
        "variant": "get",
        "warning": "",
      },
      "LabelText": {
        "excerpt": "getByLabelText(/username/i)",
        "queryArgs": [
          /username/i,
        ],
        "queryMethod": "getByLabelText",
        "queryName": "LabelText",
        "snippet": "screen.getByLabelText(/username/i)",
        "variant": "get",
        "warning": "",
      },
      "PlaceholderText": {
        "excerpt": "getByPlaceholderText(/how should i call you\\\\?/i)",
        "queryArgs": [
          /how should i call you\\\\\\?/i,
        ],
        "queryMethod": "getByPlaceholderText",
        "queryName": "PlaceholderText",
        "snippet": "screen.getByPlaceholderText(/how should i call you\\\\?/i)",
        "variant": "get",
        "warning": "",
      },
      "Role": {
        "excerpt": "getByRole('textbox', { name: /username/i })",
        "queryArgs": [
          "textbox",
          {
            "name": /username/i,
          },
        ],
        "queryMethod": "getByRole",
        "queryName": "Role",
        "snippet": "screen.getByRole('textbox', {
      name: /username/i
    })",
        "variant": "get",
        "warning": "",
      },
      "Selector": {
        "excerpt": "querySelector('#username')",
        "queryArgs": [
          "#username",
        ],
        "queryMethod": "querySelector",
        "queryName": "Selector",
        "snapshot": "screen.getByRole('textbox', { name: /username/i });",
        "snippet": "container.querySelector('#username')",
      },
      "TestId": {
        "excerpt": "getByTestId('uname')",
        "queryArgs": [
          "uname",
        ],
        "queryMethod": "getByTestId",
        "queryName": "TestId",
        "snippet": "screen.getByTestId('uname')",
        "variant": "get",
        "warning": "",
      },
      "Text": undefined,
      "Title": {
        "excerpt": "getByTitle(/enter your username/i)",
        "queryArgs": [
          /enter your username/i,
        ],
        "queryMethod": "getByTitle",
        "queryName": "Title",
        "snippet": "screen.getByTitle(/enter your username/i)",
        "variant": "get",
        "warning": "",
      },
    }
  `);
});
