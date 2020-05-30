describe('Navigation In Header Redirection Testing', () => {
  beforeEach(() => cy.visit('/'));
  it('Clicking "Common Mistakes" will redirect', () => {
    cy.get('.bg-gray-900 > .space-x-8 > a')
      .last()
      .should('have.attr', 'href')
      .and(
        'include',
        'https://kentcdodds.com/blog/common-mistakes-with-react-testing-library',
      );

    cy.get('.bg-gray-900 > .space-x-8 > a')
      .eq(2)
      .should('have.attr', 'href')
      .and('include', 'https://testing-library.com/docs/guide-which-query');

    cy.get('.bg-gray-900 > .space-x-8 > a')
      .eq(1)
      .should('have.attr', 'href')
      .and(
        'include',
        'https://testing-library.com/docs/dom-testing-library/intro',
      );
    cy.get('.bg-gray-900 > .space-x-8 > a')
      .eq(0)
      .should('have.attr', 'href')
      .and('include', 'https://github.com/smeijer/testing-playground');
  });
});
