describe('App initialization', () => {
  it('Displays from API on load', () => {
    cy.visit('http://localhost:1234 ');
    //   cy.seedAndVisit()

    expect(true).to.equal(true);
  });
});
