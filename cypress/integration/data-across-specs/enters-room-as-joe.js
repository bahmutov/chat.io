// @ts-check
/// <reference types="cypress" />

import { createRoom, createUser } from './utils'
import { loginViaApi } from '../utils'

it('enters the room', () => {
  createRoom()
  createUser().then(loginViaApi)

  // the "basement" alias was set in the "createRoom" function
  cy.get('@basement').then((id) => {
    cy.visit(`/chat/${id}`)
    cy.contains('.chat-room', 'basement')
    cy.contains('.about .name', 'Joe')
  })
})
