it('renders Testing Playground with an example', () => {
  cy.visit('/');

  cy.getMarkupEditor().should('exist');

  cy.getSandboxBody().within(() => {
    cy.findByLabelText('Email address')
      .should('exist')
      .and('have.attr', 'type', 'email')
      .and('have.attr', 'placeholder', 'Enter email');

    cy.findByText("It's safe with us. We hate spam!").should('exist');

    cy.findByLabelText('Password')
      .should('exist')
      .and('have.attr', 'type', 'password')
      .and('have.attr', 'placeholder', 'Password');

    cy.findByLabelText('I accept the terms and conditions')
      .should('exist')
      .and('have.attr', 'type', 'checkbox')
      .and('not.be.checked');

    cy.findByRole('link', { name: 'terms and conditions' })
      .should('exist')
      .and('have.attr', 'href', 'https://www.example.com');

    cy.findByRole('button', { name: 'Submit' }).should('exist');
  });

  cy.findByRole('region', { name: 'html preview' }).within(() => {
    cy.findByRole('button', { name: 'expand' }).should('exist');
    cy.findByText('accessible roles:').should('exist');
    cy.findByText('generic').should('exist');
  });

  cy.getQueryEditor().should('exist');

  cy.findByRole('region', { name: 'query suggestion' }).within(() => {
    cy.findByText('> <button type="submit" > Submit </button>').should('exist');
    cy.findByRole('button', { name: 'expand' }).should('exist');
  });

  cy.getResult().within(() => {
    cy.findByText('suggested query').should('exist');

    cy.findByText("> getByRole('button', { name: /submit/i })").should('exist');

    cy.findByRole('button', { name: 'copy query' }).should('exist');

    cy.findByText(
      'There is one thing though. You could make the query a bit more specific by adding the name option.',
    ).should('exist');

    cy.findByRole('heading', {
      level: 3,
      name: '1. Queries Accessible to Everyone',
    }).should('exist');

    cy.findByRole('heading', {
      level: 3,
      name: '2. Semantic Queries',
    }).should('exist');

    cy.findByRole('heading', {
      level: 3,
      name: '3. Test IDs',
    }).should('exist');
  });
});
