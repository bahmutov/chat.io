/// <reference types="cypress" />

import { registerOnly } from './utils'

beforeEach(() => {
  cy.task('clearUsers')
})

it('same user cannot register twice', () => {
  const name = 'Joe'
  const password = 'superSecret!'

  cy.log('**register the first time**')
  registerOnly(name, password)
  cy.get('.login-form').should('be.visible')

  cy.log('**register the second time**')
  registerOnly(name, password)
  cy.contains('.message.error', 'Username already exists').should('be.visible')
})
