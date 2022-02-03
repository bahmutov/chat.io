// @ts-check
/// <reference types="cypress-data-session" />

import { loginUser } from './utils'

describe('log in once', () => {
  const username = 'Gleb-764'
  const password = '¡SoSecret!'

  Cypress.Cookies.defaults({
    preserve: 'connect.sid',
  })

  before(() => {
    loginUser(username, password)
  })

  it('is logged in (1st test)', function () {
    cy.getCookie('connect.sid').then(JSON.stringify).then(cy.log)

    cy.visit('/')
    cy.location('pathname').should('equal', '/rooms')
    cy.contains('.user-info', username)
  })

  it('stays logged in (2nd test)', function () {
    cy.getCookie('connect.sid').then(JSON.stringify).then(cy.log)

    cy.visit('/')
    cy.location('pathname').should('equal', '/rooms')
    cy.contains('.user-info', username)
  })
})
