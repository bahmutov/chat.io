// @ts-check
/// <reference types="cypress-data-session" />

import { loginUser } from './utils'

function keepCookie(name) {
  cy.getCookie(name).then((cookie) => {
    const cookieKey = 'cookie_' + name

    if (cookie === null) {
      const keptCookie = Cypress.env(cookieKey)
      if (keptCookie) {
        // console.log({ name, cookieKey, keptCookie })
        cy.setCookie(name, keptCookie)
      }
    } else {
      // store the latest cookie value
      Cypress.env(cookieKey, cookie.value)
    }
  })
}

describe('log in once using custom preserve cookie', () => {
  // create this user yourself before running this spec
  const username = 'Gleb-764'
  const password = '¡SoSecret!'

  before(() => {
    loginUser(username, password)
  })

  beforeEach(() => {
    // does nothing for cookies that don't exist
    keepCookie('nope')
    // replace the deprecated
    // Cypress.Cookies.preserveOnce('connect.sid')
    // with our custom code
    keepCookie('connect.sid')
  })

  beforeEach(() => {
    console.log('beforeEach done')
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
