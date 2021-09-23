/// <reference types="cypress" />

import { registerUser } from './utils'

describe('messages', () => {
  beforeEach(() => {
    cy.task('clearRooms')
  })

  it('can be posted', () => {
    cy.session('Joe', () => {
      cy.task('clearUsers')
      registerUser('Joe')
    })
    cy.visit('/rooms')
    // if we get redirected, that means we could not log in
    cy.location('pathname').should('equal', '/rooms')

    cy.get('[aria-label="New room name"]').type('my own chat')
    cy.contains('button', 'Create').click()
    cy.contains('.room-item', 'my own chat').should('be.visible').click()
    cy.contains('.chat-num-users', '1 User').should('be.visible')
    cy.contains('.about .name', 'Joe')
    cy.get('.chat-message').within(() => {
      cy.get('[name=message]').type('Hello')
      cy.contains('button', 'Send').click()

      cy.get('[name=message]').type('I will be right back')
      cy.contains('button', 'Send').click()
    })

    cy.get('[data-cy=message]').should('have.length', 2)
    cy.contains('[data-cy=message]', 'Hello')
      .should('be.visible')
      .and('have.attr', 'style', '')
      .find('.message-data-name')
      .should('have.text', 'Joe')
    cy.contains('[data-cy=message]', 'I will be')
      .should('be.visible')
      .and('have.attr', 'style', '')

    cy.log('**leaving the room**')
    cy.get('[data-cy=ToRooms]').click()
    cy.contains('.room-item', 'my own chat').should('be.visible').click()
    cy.log('**back in the room**')
    cy.contains('.chat-num-users', '1 User').should('be.visible')

    // We should see the previous messages
    cy.get('.chat-history').should('be.visible')
    cy.get('[data-cy=message]').should('have.length', 2)
    cy.contains('[data-cy=message]', 'Hello').should('be.visible')
    cy.contains('[data-cy=message]', 'I will be right back').should(
      'be.visible',
    )
  })
})
