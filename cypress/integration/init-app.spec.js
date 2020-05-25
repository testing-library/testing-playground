describe('App initialization', () => {
  it('Displays from API on load', () => {
    cy.seedAndVisit();

    cy.get('.CodeMirror textarea').first().type(`<div>Hello World </div>`, {
      force: true,
    });
  });
});
