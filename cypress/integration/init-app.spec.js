describe('App initialization Smoke Test', () => {
  beforeEach(() => {
    cy.seedAndVisit();
    cy.get('.CodeMirror')
      .first()
      .then((editor) => {
        editor[0].CodeMirror.setValue('');
      });

    cy.fixture('profile.json').then((ele) =>
      cy.get('.CodeMirror textarea').first().type(ele.helloworld, {
        force: true,
      }),
    );

    cy.get('.CodeMirror')
      .first()
      .then((editor) => {
        editor.prevObject[1].CodeMirror.setValue('');
      });

    cy.get('.CodeMirror textarea').eq(1).type(`screen.getByTestId('hello')`, {
      force: true,
    });
  });

  it('Gives a suggested query more specific than the used data-testid', () => {
    cy.get('[data-cy=suggested-query]').should(
      'contain',
      `> screen.getByText('Hello World')`,
    );
    cy.get(
      '.space-y-8.px-8 > :nth-child(2) > :nth-child(1) > .CodeMirror > .CodeMirror-scroll > .CodeMirror-sizer > [style="position: relative; top: 0px;"] > .CodeMirror-lines > [style="position: relative; outline: none;"] > .CodeMirror-code > [style="position: relative;"] > .CodeMirror-line',
    ).should('contain', `screen.getByTestId('hello')`);
  });

  it('Clicking on the suggested query changes the query in code field', () => {
    cy.get('[data-cy=suggested-query]').click();
    cy.get('[data-cy=suggested-query]').should(
      'contain',
      `> screen.getByText('Hello World')`,
    );
    cy.get(
      '.space-y-8.px-8 > :nth-child(2) > :nth-child(1) > .CodeMirror > .CodeMirror-scroll > .CodeMirror-sizer > [style="position: relative; top: 0px;"] > .CodeMirror-lines > [style="position: relative; outline: none;"] > .CodeMirror-code > [style="position: relative;"] > .CodeMirror-line',
    ).should('contain', `screen.getByText('Hello World')`);
  });
});
