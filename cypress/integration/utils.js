/// <reference types="cypress" />

const { random } = Cypress._

// registers a user, but does not log in
export const registerOnly = (username, password) => {
  cy.visit('/').get('#create-account').should('be.visible').click()
  cy.get('.register-form')
    .should('be.visible')
    .within(() => {
      cy.get('[placeholder=username]').type(username)
      cy.get('[placeholder=password]').type(password)

      // detect the form update by waiting for the new document
      cy.document().then((doc) => {
        cy.contains('button', 'create').click()
        cy.document().should((d) =>
          assert(d !== doc, 'document has changed'),
        )
      })
    })
}

// yields the username and the password
export const registerUser = (name, pass) => {
  const username = name || `user ${random(1e5)}`
  const password = pass || `pass-${random(1e10)}`

  registerOnly(username, password)

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

export const registerViaApi = (name, pass) => {
  const username = name || `user ${random(1e5)}`
  const password = pass || `pass-${random(1e10)}`

  cy.request({
    method: 'POST',
    url: '/register',
    form: true,
    body: {
      username,
      password,
    },
  })
  return loginViaApi({ username, password })
}

export function loginUser(username, password) {
  // make sure no one is logged in
  cy.clearCookie('connect.sid')
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

export const loginViaApi = ({ username, password }) => {
  cy.log(`log in user **${username}**`)
  expect(username, 'username').to.be.a('string')

  // when requesting the page using cy.request,
  // the returned cookies are set too!
  cy.request('/')
  // let's check the session cookie was set
  cy.getCookie('connect.sid').should('exist')

  cy.request({
    method: 'POST',
    url: '/login',
    form: true,
    body: {
      username,
      password,
    },
  })
  return cy.wrap({ username, password })
}
