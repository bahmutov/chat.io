/// <reference types="cypress" />

import { registerUser } from './utils'

// Socket.io client to allow Cypress itself
// to connect from the plugin file to the chat app
// to play the role of another user
// https://socket.io/docs/v4/client-initialization/
import { io } from 'socket.io-client'

describe.skip('socket', () => {
  beforeEach(() => {
    cy.task('clearUsers')
    cy.task('clearRooms')
  })

  it('connects from the test', () => {
    const url = Cypress.config('baseUrl') + '/rooms'
    console.log('connecting to WS at %s', url)
    const socket = io(url, {
      transports: ['websocket'],
    })
    socket.on('connect', () => {
      console.log('creating new room')
      socket.emit('createRoom', 'kitchen')
    })

    // registerUser()
  })
})
