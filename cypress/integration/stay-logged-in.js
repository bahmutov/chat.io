// @ts-check
/// <reference types="cypress-data-session" />

import { loginUser } from './utils'

// watch the video "Stay Logged In During Tests By Preserving A Cookie"
// https://youtu.be/tXqX2SQurMc

Cypress.on('test:before:run:async', () => {
  console.log('test:before:run:async')
})

describe('log in once', () => {
  // create this user yourself before running this spec
  const username = 'Gleb-764'
  const password = '¡SoSecret!'

  // alternative to "beforeEach" with preserveOnce
  // Cypress.Cookies.defaults({
  //   preserve: 'connect.sid',
  // })

  before(() => {
    console.log('before')
    loginUser(username, password)
  })

  beforeEach(() => {
    console.log('beforeEach')
    cy.getCookie('connect.sid').then(console.log)
    Cypress.Cookies.preserveOnce('connect.sid')
    console.log('beforeEach done')
  })

  it.only('is logged in (1st test)', function () {
    console.log('first test')
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
