/// <reference types="cypress" />

import { createUser } from './data-across-specs/utils'
import { loginViaApi } from './utils'

describe('cannot find room', () => {
  beforeEach(() => {
    cy.task('clearRooms')
  })

  it('redirects to /rooms', () => {
    createUser('guest').then(({ username, password }) => {
      loginViaApi({ username, password })
      // the user can see the room list
      cy.visit('/rooms')
      cy.location('pathname').should('equal', '/rooms')
      cy.get('.user-info').should('have.text', username)

      // trying to visit non-existent room
      cy.visit('/chat/non-existent-room')
      cy.location('pathname').should('equal', '/rooms')
    })
  })
})
