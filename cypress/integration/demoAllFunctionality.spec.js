describe('All Query Selections & Buttons Funtionality', () => {
  beforeEach(() => {
    cy.seedAndVisit();

    cy.fixture('userStubs.json').then((stub) =>
      cy.get('.CodeMirror textarea').first().type(stub.html.example, {
        force: true,
      }),
    );

    cy.fixture('userStubs.json').then((stub) =>
      cy
        .get('.CodeMirror textarea')
        .eq(1)
        .type(stub.query.example.usernameTestId, {
          force: true,
        }),
    );
  });

  it('click on HTML preview "signup" button', () => {
    cy.get('[data-testid=button-testid]').click();

    cy.get('[data-cy=suggested-query]').should('contain', 'signup');
  });
});
