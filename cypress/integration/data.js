/// <reference types="cypress-data-session" />

import { loginViaApi, registerViaApi } from './utils'

// prepares the room using https://github.com/bahmutov/cypress-data-session
// SKIP requires cy.session flag
describe.skip('prepare rooms', () => {
  beforeEach(() => {
    function setupTwoRooms() {
      const roomIds = []
      cy.task('clearRooms').wait(1000, { log: false })
      cy.task('makeRoom', 'attic')
        .wait(1000, { log: false })
        .then((roomId) => {
          roomIds.push(roomId)
        })
      cy.task('makeRoom', 'kitchen')
        .wait(1000, { log: false })
        .then((roomId) => {
          roomIds.push(roomId)
        })
        .then(() => {
          return roomIds
        })
    }

    function validateTwoRooms(ids) {
      cy.log(ids)
      // a better validation would check the ids of the rooms
      cy.task('getRooms').then((rooms) => {
        const currentIds = rooms.map((room) => room._id)
        return Cypress._.isEqual(currentIds, ids)
      })
    }

    cy.dataSession('rooms', setupTwoRooms, validateTwoRooms)

    function setupUser() {
      const username = `user ${Cypress._.random(1e5)}`
      const password = `pass-${Cypress._.random(1e10)}`

      cy.request({
        method: 'POST',
        url: '/register',
        form: true,
        body: {
          username,
          password,
        },
      }).then(() => {
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

    // if the user object has been invalidated, invalidate the session too
    function userInvalidated() {
      cy.log('user invalidated')
      // https://docs.cypress.io/api/cypress-api/session
      // it would be nice if we could invalidate a single user session...
      Cypress.session.clearAllSavedSessions()
    }

    cy.dataSession('user', setupUser, validateUser, userInvalidated).then(
      (user) => {
        cy.session('logged in user', () => {
          loginViaApi(user)
        })
      },
    )
  })

  it('logs in and sees two rooms', () => {
    cy.visit('/rooms')
    cy.get('[data-cy=room]').should('have.length', 2)
  })

  it('visits the first room', function () {
    cy.visit(`/chat/${this.rooms[0]}`)
    cy.contains('.chat-room', 'attic')
  })

  it('shows the user name', function () {
    cy.visit(`/rooms`)
    cy.contains('.user-info', this.user.username)
  })
})
