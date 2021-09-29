/// <reference types="cypress" />

import { loginViaApi } from './utils'

const { random } = Cypress._

// in this test we will set up the data using cy.task commands
// and we will cache it in the Cypress.env object

describe('cy.session wrapped to yield room ids', () => {
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
    return cy.task('getRooms', null, { log: false }).then((rooms) => {
      const roomIds = Cypress._.map(rooms, '_id')
      return Cypress._.isEqual(roomIds, ids)
    })
  }

  function setupUser() {
    const username = `user ${random(1e5)}`
    const password = `pass-${random(1e10)}`

    return cy
      .request({
        method: 'POST',
        url: '/register',
        form: true,
        body: {
          username,
          password,
        },
      })
      .then(() => {
        return { username, password }
      })
  }

  function validateUser(user) {
    cy.request({
      method: 'POST',
      url: '/login',
      form: true,
      body: user,
      failOnStatusCode: false,
    })
      .its('body', { timeout: 0 })
      .then((html) => html.includes('data-cy="rooms"'))
  }

  beforeEach(() => {
    cy.dataSession('two rooms', setupTwoRooms, validate)
      // the .dataSession command yields the room ids
      .should('be.an', 'array')
      .and('have.length', 2)
      // and we can save it as an alias
      .as('roomIds')

    cy.dataSession('user', setupUser, validateUser).as('user').then(loginViaApi)
  })

  it('logs in and sees two rooms', () => {
    cy.visit('/rooms')
    cy.get('[data-cy=room]').should('have.length', 2)
  })

  it('has the kitchen', () => {
    cy.visit('/rooms')
    cy.contains('[data-cy=room]', 'kitchen')
  })

  it('visits the first chat root', function () {
    cy.visit(`/chat/${this.roomIds[0]}`)
    cy.contains('.chat-room', 'attic')
  })

  it('shows the user name', function () {
    cy.visit('/')
    cy.contains('.user-info', this.user.username).should('be.visible')
  })
})
