/// <reference types="cypress" />

import { registerViaApi } from './utils'

describe('clear rooms if needed', () => {
  beforeEach(() => {
    function checkRooms() {
      return cy.task('getRooms').then((rooms) => {
        if (
          rooms.length === 2 &&
          rooms[0].title === 'attic' &&
          rooms[1].title === 'kitchen'
        ) {
          return { attic: rooms[0]._id, kitchen: rooms[1]._id }
        }
        // DANGER: if you return undefined from cy.then
        // it will yield the original subject
        return null
      })
    }

    cy.dataSession({
      name: 'two rooms',
      init: checkRooms,
      preSetup() {
        cy.task('clearRooms').wait(1000, { log: false })
      },
      setup() {
        // slow down each command to simulate an expensive setup
        cy.task('makeRoom', 'attic')
          .wait(1000, { log: false })
          .then((attic) => {
            cy.task('makeRoom', 'kitchen')
              .wait(1000, { log: false })
              .then((kitchen) => {
                return { attic, kitchen }
              })
          })
      },
      validate(rooms) {
        return checkRooms().then((loadedRooms) => {
          return Cypress._.isEqual(rooms, loadedRooms)
        })
      },
    })
  })

  it('logs in and sees two rooms', () => {
    registerViaApi()
    cy.visit('/rooms')
    cy.get('[data-cy=room]').should('have.length', 2)
  })
})
