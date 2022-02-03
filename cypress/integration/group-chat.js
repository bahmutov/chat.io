/// <reference types="cypress" />

import { registerUser } from './utils'
const { random } = Cypress._

function createRoom(roomName) {
  cy.get('[aria-label="New room name"]').type(roomName)
  cy.contains('button', 'Create').click()
  cy.contains('.room-num-rooms', '1 Room')
  cy.contains('.room-item', roomName).should('be.visible')
}

function messageVisible(message, username) {
  cy.contains('[data-cy=message]', message)
    .should('be.visible')
    .and('have.attr', 'style', '')
    .within(() => {
      if (username) {
        cy.contains('.message-data-name', username)
      }
    })
}

function postMessage(message) {
  cy.get('.chat-message').within(() => {
    cy.get('[name=message]').type(message)
    cy.contains('button', 'Send').click()
  })
  messageVisible(message)
}

// SKIP requires cy.session flag
describe.skip('group chat', () => {
  let roomUrl

  beforeEach(() => {
    cy.task('clearRooms')
    // create a room using a separate session
    // and a separate user to avoid clashing with other user sessions
    cy.session('utility user', () => {
      registerUser(`utility ${random(1e4)}`)
    })
    cy.visit('/rooms')
    createRoom('hang')
    cy.contains('.room-item', 'hang').should('be.visible').click()

    cy.location('pathname')
      .should('include', '/chat/')
      .then((url) => {
        roomUrl = url
      })
  })

  function visitAsUser(username) {
    cy.session('user' + username, () => {
      registerUser(username)
    })
    // directly to the room
    cy.visit(roomUrl)
  }

  it('messages going around', () => {
    visitAsUser('userA')
    // we are in the right room
    cy.contains('.chat-room', 'hang')
    postMessage('First!')

    visitAsUser('userB')
    messageVisible('First!', 'userA')
    postMessage('Second!!')

    visitAsUser('userC')
    messageVisible('First!', 'userA')
    messageVisible('Second!!', 'userB')
    postMessage('Uggh, late again')

    // back to the first user
    visitAsUser('userA')
    messageVisible('First!', 'userA')
    messageVisible('Second!!', 'userB')
    messageVisible('Uggh, late again', 'userC')
    postMessage('No worries')

    // third user sees the reply
    visitAsUser('userC')
    messageVisible('No worries', 'userA')
  })
})
