/// <reference types="cypress" />

function registerUser(username, password) {
  cy.visit('/')

  cy.get('#create-account').should('be.visible').click()
  cy.get('.register-form')
    .should('be.visible')
    .within(() => {
      cy.get('[placeholder=username]')
        .type(username)
        .should('have.value', username)
      cy.get('[placeholder=password]').type(password)

      cy.contains('button', 'create')
        .click()
        // the app disables the button while submitting the form
        .should('be.disabled')
    })
  // if everything goes well
  cy.contains('.success', 'Your account has been created').should('be.visible')
}

function loginUser(username, password) {
  cy.visit('/')

  cy.get('.login-form')
    .should('be.visible')
    .within(() => {
      cy.get('[placeholder=username]')
        .type(username)
        .should('have.value', username)
      cy.get('[placeholder=password]').type(password)

      cy.contains('button', 'login')
        .click()
        // the app disables the button while submitting the form
        .should('be.disabled')
    })
}

let username
let password

beforeEach(() => {
  username = Cypress.env('username')
  password = Cypress.env('password')
  if (!username) {
    username = 'Gleb-' + Cypress._.random(1e3)
    password = '¡SoSecret!'
    Cypress.env('username', username)
    Cypress.env('password', password)
    registerUser(username, password)
  }
})

it('creates a random user once', () => {
  loginUser(username, password)
  cy.location('pathname').should('equal', '/rooms')
  cy.contains('.user-info', username)
})
