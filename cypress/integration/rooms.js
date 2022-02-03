/// <reference types="cypress" />

import { registerUser } from './utils'

const { random } = Cypress._

// SKIP requires cy.session flag
describe.skip('creating rooms', () => {
  beforeEach(() => {
    cy.task('clearRooms')
    cy.session('logged in', registerUser)
    cy.visit('/rooms')
  })

  it('has no rooms', () => {
    cy.contains('.room-num-rooms', '0 Room')
  })

  it('creates a room', () => {
    const roomName = `room ${random(1e5)}`
    cy.get('[aria-label="New room name"]').type(roomName)
    cy.contains('button', 'Create').click()
    cy.contains('.room-num-rooms', '1 Room')
    cy.contains('.room-item', roomName).should('be.visible')
  })

  it('goes into a room', () => {
    const roomName = `room ${random(1e5)}`
    cy.get('[aria-label="New room name"]').type(roomName)
    cy.contains('button', 'Create').click()
    cy.contains('.room-item', roomName).should('be.visible').click()
    cy.location('pathname').should('include', '/chat/')
    cy.contains('.chat-room', roomName).should('be.visible')
    cy.log('**back to the rooms**')
    cy.contains('.controls a', 'Rooms').click()
    cy.location('pathname').should('equal', '/rooms')
  })

  it('creates a room using task', () => {
    cy.task('makeRoom', 'attic')
      .should('be.a', 'string')
      .then((roomId) => {
        cy.visit('/chat/' + roomId)
        cy.contains('.chat-room', 'attic').should('be.visible')
      })
  })
})
