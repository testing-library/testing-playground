export const initialValues = {
  html: `
<label for='username'>Username</label>
<input id='username' name="username" placeholder="how should I call you?" />
<button name="signup" type="submit">signup</button>
`.trim(),

  js: `
screen.getByRole('button')
screen.getByLabelText(/username/i)
`.trim(),
};

// some quotes from https://testing-library.com/docs/guide-which-query
export const messages = [
  {
    heading: 'Queries Accessible to Everyone',
    description: `queries that reflect the experience of visual/mouse users as well as those that use assistive technology. These should be your top preference.`,
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

export const faq = [
  {
    title: 'common mistakes',
    url:
      'https://kentcdodds.com/blog/common-mistakes-with-react-testing-library',
  },
  {
    title: 'priority',
    url: 'https://testing-library.com/docs/guide-which-query',
  },
];
