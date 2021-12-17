/// <reference types="cypress" />

import { registerViaApi } from './utils'

describe('prepare rooms', () => {
  before(() => {
    // slow down each command to simulate an expensive setup
    cy.task('clearRooms').wait(1000, { log: false })
  })

  beforeEach(() => {
    // create and cache each room separately
    cy.dataSession({
      name: 'attic',
      init() {
        cy.task('findRoom', 'attic').then((room) => {
          console.log('attic', room)
          return room && room._id
        })
      },
      setup() {
        cy.task('makeRoom', 'attic').wait(1000, { log: false })
      },
      validate(id) {
        cy.task('getRoom', id).then((room) => room && room.title === 'attic')
      },
    })

    cy.dataSession({
      name: 'kitchen',
      init() {
        cy.task('findRoom', 'kitchen').then((room) => {
          return room && room._id
        })
      },
      setup() {
        cy.task('makeRoom', 'kitchen').wait(1000, { log: false })
      },
      validate(id) {
        cy.task('getRoom', id).then((room) => room && room.title === 'kitchen')
      },
    })
  })

  it('logs in and sees two rooms', function () {
    registerViaApi()
    cy.visit('/rooms')
    cy.get('[data-cy=room]').should('have.length', 2)
    cy.contains('[data-cy=room]', 'attic').should('be.visible')
    cy.contains('[data-cy=room]', 'kitchen').should('be.visible')
    cy.log('**has attic room**')
    cy.contains('[data-cy=room]', 'attic').click()
    cy.location('pathname').should('equal', `/chat/${this.attic}`)
  })
})
