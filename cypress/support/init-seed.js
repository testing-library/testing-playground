Cypress.Commands.add('seedAndVisit', (seedData) => {
  cy.visit('/');
  cy.get('.CodeMirror')
    .first()
    .then((editor) => {
      editor[0].CodeMirror.setValue('');
    });

  cy.get('.CodeMirror')
    .first()
    .then((editor) => {
      editor.prevObject[1].CodeMirror.setValue('');
    });
});
