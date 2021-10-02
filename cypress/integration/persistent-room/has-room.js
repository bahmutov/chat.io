// @ts-check
/// <reference types="cypress-data-session" />

import { createRoom } from './utils'
import { registerViaApi } from '../utils'

it('has the bedroom', () => {
  createRoom('bedroom')
  registerViaApi()

  // the alias was set in the "createRoom" function
  cy.get('@bedroom').then((id) => {
    cy.visit(`/chat/${id}`)
    cy.contains('.chat-room', 'bedroom')
  })
})
