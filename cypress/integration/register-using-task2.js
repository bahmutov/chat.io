// @ts-check
/// <reference types="cypress-data-session" />

import { loginViaApi } from './utils'

describe('user registration using cy.task', () => {
  it('registers the user', () => {
    cy.task('clearUsers')

    const username = 'Mary'
    const password = 'Secret!'
    cy.task('makeUser', { username, password })
      // yields user id
      .should('be.a', 'string')

    loginViaApi({ username, password })
    cy.visit('/rooms')
    cy.get('.user-info').should('have.text', username)
  })
})
