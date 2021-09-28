/// <reference types="cypress" />

import { registerViaApi } from './utils'

describe('prepare using cy.session', () => {
  beforeEach(() => {
    function setupTwoRooms() {
      // slow down each command to simulate an expensive setup
      cy.task('clearRooms').wait(1000, { log: false })
      cy.task('makeRoom', 'attic').wait(1000, { log: false })
      cy.task('makeRoom', 'kitchen').wait(1000, { log: false })
    }

    function validate() {
      cy.task('getRooms')
        .should('have.length', 2)
        .then((rooms) => {
          expect(rooms[0].title).to.eq('attic')
          expect(rooms[1].title).to.eq('kitchen')
        })
    }

    cy.session('has two rooms', setupTwoRooms, {
      validate,
    })
  })

  it('logs in and sees two rooms', () => {
    registerViaApi()
    cy.visit('/rooms')
    cy.get('[data-cy=room]').should('have.length', 2)
  })
})
