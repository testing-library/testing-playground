Cypress.Commands.add('seedAndVisit', (seedData) => {
  // Any data can be dynamically seeded once Fixtures are created
  cy.visit('/');
});
