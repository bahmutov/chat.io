// @ts-check
/// <reference types="cypress" />

import { createRoom, createUser } from './utils'
import { loginViaApi } from '../utils'

it('sees rooms attic and bedroom', () => {
  createRoom('attic')
  createRoom('bedroom')
  createUser().then(loginViaApi)
  cy.visit('/rooms')
  cy.get('[data-cy=room]')
    // there might be other rooms there
    // but at least "attic" and "bedroom" should be there
    .should('have.length.gte', 2)
  cy.contains('[data-cy=room]', 'attic')
  cy.contains('[data-cy=room]', 'bedroom')
})
