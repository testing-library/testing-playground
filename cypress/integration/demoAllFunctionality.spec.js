describe('All Query Selections & Buttons Funtionality', () => {
  beforeEach(() => {
    cy.visitAndClear();
    cy.fixture('userStubs.json').then((stub) =>
      cy
        .get('.CodeMirror textarea')
        .eq(1)
        .type(stub.query.example.usernameTestId, {
          force: true,
        }),
    );
  });

  it('Click on HTML preview "signup" & query options "text", "testId", and "role"', () => {
    cy.fixture('userStubs.json').then((stub) =>
      cy.get('.CodeMirror textarea').first().type(stub.html.shortExample, {
        force: true,
      }),
    );
    cy.get('[data-testid=button-testid]').click();
    cy.get('[data-cy=suggested-query]').should('contain', 'signup');

    cy.get(':nth-child(2) > .field > .truncate').click();
    cy.get('p').should('contain', 'getByTestId');

    cy.get('.grid > :nth-child(1) > :nth-child(5)').click();
    cy.get('p').should('contain', 'getByText');

    cy.get('.grid > :nth-child(1) > :nth-child(2) > .truncate').click();
    cy.get('p').should('contain', 'great');
  });

  it('Click on HTML preview input field & query options "labelText", "placeholderText", "displayValue", "altText" and "title"', () => {
    cy.fixture('userStubs.json').then((stub) =>
      cy.get('.CodeMirror textarea').first().type(stub.html.example, {
        force: true,
      }),
    );
    cy.get('[data-testid=uname-testid]').click();
    cy.get('[data-cy=suggested-query]').should('contain', 'textbox');

    cy.get('.grid > :nth-child(1) > :nth-child(3) > .truncate').click();
    cy.get('p').should('contain', 'getByLabelText');

    cy.get(':nth-child(4) > .truncate').click();
    cy.get('p').should('contain', 'getByPlaceholderText');

    cy.get(':nth-child(6) > .truncate').click();
    cy.get('p').should('contain', 'getByDisplayValue');

    cy.get('.space-y-8 > :nth-child(1) > :nth-child(2) > .truncate').click();
    cy.get('p').should('contain', 'getByAltText');

    cy.get('.space-y-8 > :nth-child(1) > :nth-child(3) > .truncate').click();
    cy.get('p').should('contain', 'getByTitle');
  });
});
