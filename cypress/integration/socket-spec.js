/// <reference types="cypress" />

import { registerViaApi } from './utils'

// Socket.io client to allow Cypress itself
// to connect from the plugin file to the chat app
// to play the role of another user
const io = require('socket.io-client')

describe('socket', () => {
  beforeEach(() => {
    cy.task('clearUsers')
    cy.task('clearRooms')
  })

  it('connects from the test', () => {
    // room name to create
    const roomName = 'kitchen'

    const url = Cypress.config('baseUrl') + '/rooms'
    const socket = io(url, {
      transports: ['websocket'],
    })
    socket.on('connect', () => {
      socket.emit('createRoom', roomName)
    })

    registerViaApi()
    cy.visit('/rooms')
    cy.location('pathname').should('equal', '/rooms')
    cy.contains('.room-item', roomName).should('be.visible').click()
    cy.location('pathname').should('include', '/chat/')
    cy.contains('.chat-room', roomName).should('be.visible')
  })
})
