// @ts-check
/// <reference types="cypress-data-session" />

import { loginUser } from './utils'

// watch the video "Stay Logged In During Tests By Preserving A Cookie"
// https://youtu.be/tXqX2SQurMc

describe('log in once', () => {
  const username = 'Gleb-764'
  const password = '¡SoSecret!'

  // alternative to "beforeEach" with preserveOnce
  // Cypress.Cookies.defaults({
  //   preserve: 'connect.sid',
  // })

  before(() => {
    loginUser(username, password)
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('connect.sid')
  })

  it('is logged in (1st test)', function () {
    cy.visit('/')
    cy.location('pathname').should('equal', '/rooms')
    cy.contains('.user-info', username)
  })

  it('stays logged in (2nd test)', function () {
    cy.visit('/')
    cy.location('pathname').should('equal', '/rooms')
    cy.contains('.user-info', username)
  })

  it('stays logged in (3rd test)', function () {
    cy.visit('/')
    cy.location('pathname').should('equal', '/rooms')
    cy.contains('.user-info', username)
  })
})
