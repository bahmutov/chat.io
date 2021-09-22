/// <reference types="cypress" />

const { random } = Cypress._

// yields the username and the password
export const registerUser = () => {
  const username = `user ${random(1e5)}`
  const password = `pass-${random(1e10)}`
  cy.visit('/').get('#create-account').click()
  cy.get('.register-form')
    .should('be.visible')
    .within(() => {
      cy.get('[placeholder=username]').type(username)
      cy.get('[placeholder=password]').type(password)
      cy.contains('button', 'create').click()
    })
  cy.get('.login-form')
    .should('be.visible')
    .within(() => {
      cy.get('[placeholder=username]').type(username)
      cy.get('[placeholder=password]').type(password)
      cy.contains('button', 'login').click()
    })
  cy.location('pathname').should('equal', '/rooms')
  return cy.wrap({ username, password })
}
