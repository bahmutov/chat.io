/// <reference types="cypress" />

import { registerViaApi } from './utils'

// compare this spec to the "prepare-rooms.js" file
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

    // by using "cy.session" with "validate" function
    // we only clear the state and create the rooms when necessary
    // https://on.cypress.io/session
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
