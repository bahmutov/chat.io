/// <reference types="cypress" />

import { registerUser } from './utils'

it('registers a new user', () => {
  registerUser().should('have.keys', 'username', 'password')
})

it('logs out', () => {
  registerUser()

  // confirms we have the session cookie set
  // this cookie is used by the server to authenticate
  cy.getCookie('connect.sid').then(console.log)

  cy.visit('/rooms')
  cy.get('[data-cy=logout]').should('be.visible').click()
  cy.get('.login-form').should('be.visible')
  // by the way, the cookie "connect.sid" has now a new value
})

// cannot use cy.session with the user log out
// because the act of logging out destroys the session
// preventing its reuse in the next run
// But we can still use the session to confirm
// the "log out" link is visible
// SKIP requires cy.session flag
it.skip('sees the log out link', () => {
  cy.session('logged in', registerUser)

  // confirms we have the session cookie set
  // this cookie is used by the server to authenticate
  cy.getCookie('connect.sid').then(console.log)
  cy.visit('/rooms')
  cy.get('[data-cy=logout]').should('be.visible')
})
