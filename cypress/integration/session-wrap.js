/// <reference types="cypress" />

import { registerViaApi } from './utils'

// in this test we will set up the data using cy.task commands
// and we will cache it in the Cypress.env object

// The predicate "validate" function checks the cached data
// against the current data to determine if we need to re-run
// the setup commands.
Cypress.Commands.add('dataSession', (name, setup, validate) => {
  const dataKey = 'dataSession:' + name

  const setupAndSaveData = () => {
    cy.then(setup).then((data) => {
      if (data === undefined) {
        throw new Error('dataSession cannot yield undefined')
      }
      // save the data for this session
      Cypress.env(dataKey, data)
    })
  }

  cy.log(`dataSession **${name}**`)
  const value = Cypress.env(dataKey)
  if (value === undefined) {
    return setupAndSaveData()
  }

  cy.then(() => validate(value)).then((valid) => {
    if (valid) {
      cy.log(`data **${name}** is still valid`)
      cy.wrap(value, { log: false })
      return
    }

    cy.log(`recompute data for **${name}**`)
    // TODO: validate the value yielded by the setup
    return setupAndSaveData()
  })
})
// add a simple method to clear data for a specific session
Cypress.clearDataSession = (name) => {
  const dataKey = 'dataSession:' + name
  Cypress.env(dataKey, undefined)
  console.log('cleared data session "%s"', name)
}

describe('cy.session wrapped to yield room ids', () => {
  beforeEach(() => {
    function setupTwoRooms() {
      const roomIds = []
      // slow down each command to simulate an expensive setup
      cy.task('clearRooms').wait(1000, { log: false })
      cy.task('makeRoom', 'attic')
        .wait(1000, { log: false })
        .then((id) => roomIds.push(id))
      cy.task('makeRoom', 'kitchen')
        .wait(1000, { log: false })
        .then((id) => roomIds.push(id))
        .then(() => {
          return roomIds
        })
    }

    // this function cannot have failed Cypress commands
    // it must yield a boolean value
    function validate(ids) {
      return cy.task('getRooms').then((rooms) => {
        const roomIds = Cypress._.map(rooms, '_id')
        return Cypress._.isEqual(roomIds, ids)
      })
    }

    cy.dataSession('two rooms', setupTwoRooms, validate)
  })

  it('logs in and sees two rooms', () => {
    registerViaApi()
    cy.visit('/rooms')
    cy.get('[data-cy=room]').should('have.length', 2)
  })

  it('has the kitchen', () => {
    registerViaApi()
    cy.visit('/rooms')
    cy.contains('[data-cy=room]', 'kitchen')
  })
})
