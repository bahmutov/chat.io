/// <reference types="cypress" />

import { registerViaApi } from './utils'

describe('clear rooms if needed', () => {
  beforeEach(() => {
    // slow down each command to simulate an expensive setup
    cy.task('clearRooms').wait(1000, { log: false })
    cy.task('makeRoom', 'attic').wait(1000, { log: false })
    cy.task('makeRoom', 'kitchen').wait(1000, { log: false })
  })

  it('logs in and sees two rooms', () => {
    registerViaApi()
    cy.visit('/rooms')
    cy.get('[data-cy=room]').should('have.length', 2)
  })
})
