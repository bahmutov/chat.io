/// <reference types="cypress" />

const { random } = Cypress._

// registers a user, but does not log in
export const registerOnly = (username, password) => {
  cy.visit('/').get('#create-account').click()
  cy.get('.register-form')
    .should('be.visible')
    .within(() => {
      cy.get('[placeholder=username]').type(username)
      cy.get('[placeholder=password]').type(password)

      // detect the form update by waiting for the new document
      cy.document().then((doc) => {
        cy.contains('button', 'create').click()
        cy.document().should((d) => assert(d !== doc, 'document has changed'))
      })
    })
}

// yields the username and the password
export const registerUser = (name) => {
  const username = name || `user ${random(1e5)}`
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
