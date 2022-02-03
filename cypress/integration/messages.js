/// <reference types="cypress" />

import { registerUser } from './utils'

// SKIP requires cy.session flag
describe.skip('messages', () => {
  beforeEach(() => {
    cy.task('clearRooms')
  })

  // example script to inject CSS to highlight all elements with data-cy attribute
  // so we can see which parts of the page have easy to find elements
  // https://on.cypress.io/best-practices#Selecting-Elements
  beforeEach(() => {
    cy.intercept('GET', '/css/style.css', (req) => {
      // prevent the server from responding with 304 "not modified"
      delete req.headers['if-modified-since']
      delete req.headers['if-none-match']
      req.continue((res) => {
        res.body += `
          [data-cy] {
            border: 2px solid red !important;
            margin: -2px;
          }
        `
      })
    }).as('style')
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
