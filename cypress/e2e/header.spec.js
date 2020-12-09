it('renders Testing Playground Header', () => {
  cy.visit('/');

  cy.findByRole('heading', {
    level: 1,
    name: 'Testing Playground mascot Froggy ️ Testing Playground',
  }).should('exist');

  cy.findByRole('link', {
    name: 'Testing Playground mascot Froggy ️ Testing Playground',
  })
    .should('exist')
    .and('have.attr', 'href', '/');

  cy.findByRole('button', { name: /playground/i }).should('exist');
  cy.findByRole('button', { name: /run/i }).should('exist');
  cy.findByRole('button', { name: /settings/i }).should('exist');
  cy.findByRole('button', { name: /more info/i }).should('exist');

  cy.findByRole('button', { name: /playground/i }).click();
  // playground menu shows
  cy.findByRole('menuitem', { name: /new/i }).should('exist');
  cy.findByRole('menuitem', { name: /save/i }).should('exist');
  cy.findByRole('menuitem', { name: /fork/i }).should('exist');
  cy.findByRole('menuitem', { name: /share/i }).should('exist');
  cy.findByRole('menuitem', { name: /embed/i }).should('exist');

  cy.findByRole('button', { name: /settings/i }).click();
  // previous menu disappear
  cy.findByRole('menuitem', { name: /new/i }).should('not.exist');
  cy.findByRole('menuitem', { name: /save/i }).should('not.exist');
  cy.findByRole('menuitem', { name: /fork/i }).should('not.exist');
  cy.findByRole('menuitem', { name: /share/i }).should('not.exist');
  cy.findByRole('menuitem', { name: /embed/i }).should('not.exist');

  // settings menu shows
  cy.findByLabelText(/auto-run code/i).should('exist');
  cy.findByLabelText(/test-id attribute:/i).should('exist');

  cy.findByRole('button', { name: /more info/i }).click();
  // previous menu disappear
  cy.findByLabelText(/auto-run code/i).should('not.be.visible');
  cy.findByLabelText(/test-id attribute:/i).should('not.be.visible');

  // more info menu shows
  cy.findByRole('menuitem', { name: /roadmap/i }).should('exist').and('have.attr', 'href', 'https://github.com/testing-library/testing-playground/projects/1');
  cy.findByRole('menuitem', { name: /github/i }).should('exist').and('have.attr', 'href', 'https://github.com/testing-library/testing-playground/issues');
  cy.findByRole('menuitem', { name: /support us/i }).should('exist').and('have.attr', 'href', 'https://github.com/sponsors/smeijer');
  cy.findByRole('menuitem', { name: /twitter/i }).should('exist').and('have.attr', 'href', 'https://twitter.com/meijer_s');
  cy.findByRole('menuitem', { name: /chrome extension/i }).should('exist').and('have.attr', 'href', 'https://chrome.google.com/webstore/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano');
  cy.findByRole('menuitem', { name: /introduction/i }).should('exist').and('have.attr', 'href', 'https://testing-library.com/docs/dom-testing-library/intro');
  cy.findByRole('menuitem', { name: /query priority/i }).should('exist').and('have.attr', 'href', 'https://testing-library.com/docs/guide-which-query');
  cy.findByRole('menuitem', { name: /common mistakes/i }).should('exist').and('have.attr', 'href', 'https://kentcdodds.com/blog/common-mistakes-with-react-testing-library');

  // click outside
  cy.findByRole('button', { name: /more info/i }).parent().click();
  // previous menu disappear
  cy.findByRole('menuitem', { name: /roadmap/i }).should('not.exist');
  cy.findByRole('menuitem', { name: /github/i }).should('not.exist');
  cy.findByRole('menuitem', { name: /support us/i }).should('not.exist');
  cy.findByRole('menuitem', { name: /twitter/i }).should('not.exist');
  cy.findByRole('menuitem', { name: /chrome extension/i }).should('not.exist');
  cy.findByRole('menuitem', { name: /introduction/i }).should('not.exist');
  cy.findByRole('menuitem', { name: /query priority/i }).should('not.exist');
  cy.findByRole('menuitem', { name: /common mistakes/i }).should('not.exist');
});
