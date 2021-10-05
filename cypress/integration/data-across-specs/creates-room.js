// @ts-check
/// <reference types="cypress" />

import { createRoom } from './utils'

it('creates the room', () => {
  createRoom()
  // finds the room by id (or creates it if it doesn't exist)
  // in most cases, no need to create the room, since
  // it was created in this spec (or other specs)
  // and its ID was stored in the plugin process by the plugin
  // cypress-data-session and is shared by multiple specs
  cy.get('@basement').then((id) => {
    cy.task('getRoom', id).should('have.property', 'title', 'basement')
  })
})

it('yields the room id', () => {
  createRoom().then((id) => {
    expect(id, 'room id').to.be.a('string')
    cy.task('getRoom', id)
      // confirm the room's name
      .should('have.property', 'title', 'basement')
  })
})
