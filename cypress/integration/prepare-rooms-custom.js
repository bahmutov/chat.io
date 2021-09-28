/// <reference types="cypress" />

import { registerViaApi } from './utils'

describe('prepare rooms', () => {
  beforeEach(() => {
    cy.task('getRooms').then((rooms) => {
      // check if the rooms are already prepared
      if (
        rooms.length !== 2 ||
        rooms[0].title !== 'attic' ||
        rooms[1].title !== 'kitchen'
      ) {
        // otherwise, prepare the rooms
        // slow down each command to simulate an expensive setup
        cy.task('clearRooms').wait(1000, { log: false })
        cy.task('makeRoom', 'attic').wait(1000, { log: false })
        cy.task('makeRoom', 'kitchen').wait(1000, { log: false })
      }
    })
  })

  it('logs in and sees two rooms', () => {
    registerViaApi()
    cy.visit('/rooms')
    cy.get('[data-cy=room]').should('have.length', 2)
  })
})
