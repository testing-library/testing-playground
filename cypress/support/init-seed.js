Cypress.Commands.add('seedAndVisit', (seedData) => {
  // cy.server()
  // cy.route('GET', '/api/todos', seedData).as('load')

  cy.visit('/');

  cy.wait('@load');
});
