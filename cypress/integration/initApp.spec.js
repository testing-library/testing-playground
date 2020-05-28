describe('App Initialization Smoke Test', () => {
  beforeEach(() => {
    cy.seedAndVisit();

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
      `screen.getByText('Hello World')`,
    );
    cy.get(
      '.space-y-8.px-8 > :nth-child(2) > :nth-child(1) > .CodeMirror > .CodeMirror-scroll > .CodeMirror-sizer > [style="position: relative; top: 0px;"] > .CodeMirror-lines > [style="position: relative; outline: none;"] > .CodeMirror-code > [style="position: relative;"] > .CodeMirror-line',
    ).should('contain', `screen.getByTestId('hello')`);
  });

  it('Clicking on the suggested query changes the query in code field', () => {
    cy.get('[data-cy=suggested-query]').click();
    cy.get('[data-cy=suggested-query]').should(
      'contain',
      `screen.getByText('Hello World')`,
    );
    cy.get(
      '.space-y-8.px-8 > :nth-child(2) > :nth-child(1) > .CodeMirror > .CodeMirror-scroll > .CodeMirror-sizer > [style="position: relative; top: 0px;"] > .CodeMirror-lines > [style="position: relative; outline: none;"] > .CodeMirror-code > [style="position: relative;"] > .CodeMirror-line',
    ).should('contain', `screen.getByText('Hello World')`);
  });
});
