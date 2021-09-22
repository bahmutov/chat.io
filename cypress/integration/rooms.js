/// <reference types="cypress" />

import { registerUser } from './utils'

const { random } = Cypress._

describe('rooms', () => {
  it('creates a room', () => {
    cy.session('logged in', registerUser)
    cy.visit('/rooms')
    // const roomName = `room ${random(1e5)}`
    // cy.get('[aria-label="New room name"]').type(roomName)
    // cy.contains('button', 'Create').click()
    // cy.contains('.room-item', roomName).should('be.visible')
  })
})
