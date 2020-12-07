// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Add common command to get the body of the sandbox iframe
// See: https://www.cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/
Cypress.Commands.add('getSandboxBody', () => {
  cy.log('getSandboxBody');

  return cy
    .findByTitle('sandbox')
    .its('0.contentDocument.body', { log: false })
    .should('not.be.empty')
    .then((body) => cy.wrap(body, { log: false }));
});

// Add commands to clear CodeMirror editors
// See: https://stackoverflow.com/questions/62012319/how-can-i-clear-a-codemirror-editor-field-from-cypress

Cypress.Commands.add('clearMarkupEditor', () => {
  cy.log('clearMarkupEditor');

  cy.get('.CodeMirror', { log: false })
    .first({ log: false })
    .its('0.CodeMirror', { log: false })
    .then((editor) => {
      editor.setValue('');
    });
});

Cypress.Commands.add('clearQueryEditor', () => {
  cy.log('clearQueryEditor');

  cy.get('.CodeMirror', { log: false })
    .last({ log: false })
    .its('0.CodeMirror', { log: false })
    .then((editor) => {
      editor.setValue('');
    });
});

Cypress.Commands.add('getMarkupEditor', () => {
  cy.log('getMarkupEditor');

  return cy.get('.CodeMirror textarea', { log: false }).first({ log: false });
});

Cypress.Commands.add('getQueryEditor', () => {
  cy.log('getQueryEditor');

  return cy.get('.CodeMirror textarea', { log: false }).last({ log: false });
});

Cypress.Commands.add('getResult', () => {
  cy.log('getResult');

  return cy.get('div[data-testid=result]', { log: false });
});
