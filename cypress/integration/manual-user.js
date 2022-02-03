/// <reference types="cypress" />
// pass the user through --env arguments or via cypress.json
// SKIP only made this test for a demo
it.skip('logs in', () => {
  const username = Cypress.env('username')
  const password = Cypress.env('password')
  cy.visit('/')
  cy.get('.login-form').within(() => {
    cy.get('[placeholder=username]').type(username)
    cy.get('[placeholder=password]').type(password)
    cy.contains('button', 'login').click()
  })
  cy.location('pathname').should('equal', '/rooms')
})
