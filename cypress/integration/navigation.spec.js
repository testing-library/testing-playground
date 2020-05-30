describe('Navigation In Header Redirection Testing', () => {
  beforeEach(() => cy.visit('/'));
  it('Clicking "Common Mistakes" will redirect', () => {
    cy.get('.bg-gray-900 > .space-x-8 > a')
      .last()
      .should('have.attr', 'href')
      .and('include', 'common-mistakes');
  });
});
