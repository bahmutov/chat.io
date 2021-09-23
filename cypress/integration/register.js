/// <reference types="cypress" />

import { registerUser } from './utils'

it('registers the user successfully', () => {
  const name = 'u'
  Cypress._.times(5, () => {
    cy.task('clearUsers')
    registerUser(name)
  })
})
