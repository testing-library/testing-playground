export const initialValues = {
  markup: `
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
<button name="signup" type="submit">signup</button>
`.trim(),

  query: `
// Query your elements here, preferably with 
// \`screen.getBy…(…)\`. If you can't use
// screen use \`container.querySelector(…)\`.

// container.querySelector('input')
screen.getByRole('button')
`.trim(),
};

export const queries = [
  { method: 'getByRole', level: 0 },
  { method: 'getByLabelText', level: 0 },
  { method: 'getByPlaceholderText', level: 0 },
  { method: 'getByText', level: 0 },
  { method: 'getByDisplayValue', level: 0 },

  { method: 'getByAltText', level: 1 },
  { method: 'getByTitle', level: 1 },

  { method: 'getByTestId', level: 2 },

  { method: 'querySelector', level: 3 },
];

// some quotes from https://testing-library.com/docs/guide-which-query
export const messages = [
  {
    heading: 'Queries Accessible to Everyone',
    description: `Queries that reflect the experience of visual/mouse users as well as those that use assistive technology. These should be your top preference.`,
  },
  {
    heading: 'Semantic Queries',
    description: `HTML5 and ARIA compliant selectors. Note that the user experience of interacting with these attributes varies greatly across browsers and assistive technology.`,
  },
  {
    heading: 'Test IDs',
    description: `The user cannot see (or hear) these, so this is only recommended for cases where you can't match by role or text or it doesn't make sense (e.g. the text is dynamic).`,
  },
  {
    heading: 'Manual Queries',
    description: `On top of the queries provided by the testing library, you can use the regular querySelector DOM API to query elements. Note that using this as an escape hatch to query by class or id is a bad practice because users can't see or identify these attributes. Use a testid if you have to.`,
  },
];

export const links = {
  testing_library_docs: {
    title: 'Docs',
    url: 'https://testing-library.com/docs/dom-testing-library/intro',
  },

  common_mistakes: {
    title: 'Common Mistakes',
    url:
      'https://kentcdodds.com/blog/common-mistakes-with-react-testing-library',
  },

  which_query: {
    title: 'Query Priority',
    url: 'https://testing-library.com/docs/guide-which-query',
  },
};
