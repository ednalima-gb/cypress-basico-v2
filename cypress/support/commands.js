Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
    cy.get('#firstName').type('Edna')
    cy.get('#lastName').type('Barboza')
    cy.get('#email').type('edna@e.com')
    cy.get('#phone').type('12345')
    cy.get('#open-text-area').type('Teste')
    cy.get('button[type="submit"]').click()
})