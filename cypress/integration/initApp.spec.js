describe('App Initialization Smoke Test', () => {
  beforeEach(() => {
    cy.visitAndClear();

    cy.fixture('userStubs.json').then((stub) =>
      cy.get('.CodeMirror textarea').first().type(stub.html.helloWorld, {
        force: true,
      }),
    );

    cy.fixture('userStubs.json').then((stub) =>
      cy.get('.CodeMirror textarea').eq(1).type(stub.query.helloWorld, {
        force: true,
      }),
    );
  });

  it('Gives a suggested query more specific than the used data-testid', () => {
    cy.get('[data-cy=suggested-query]').should(
      'contain',
      "screen.getByText('Hello World')",
    );
    cy.get('.query-editor > .w-full > .CodeMirror').should(
      'contain',
      "screen.getByTestId('hello')",
    );
  });

  it('Clicking on the suggested query changes the query in code field', () => {
    cy.get('[data-cy=suggested-query]').click();
    cy.get('[data-cy=suggested-query]').should(
      'contain',
      "screen.getByText('Hello World')",
    );
    cy.get('.query-editor > .w-full > .CodeMirror').should(
      'contain',
      "screen.getByText('Hello World')",
    );
  });
});
