/// <reference types="cypress" />

import { registerUser } from './utils'

it('registers the user successfully', () => {
  const name = 'u'
  Cypress._.times(20, () => {
    cy.task('clearUsers')
    registerUser(name)
  })
})
