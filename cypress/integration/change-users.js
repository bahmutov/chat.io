/// <reference types="cypress" />

import { registerUser } from './utils'

// SKIP requires cy.session flag
describe.skip('different users', () => {
  it('can log in instantly', () => {
    // we are using cy.session command
    // https://on.cypress.io/session
    cy.session('first user', () => registerUser('first'))
    cy.visit('/rooms')
    cy.contains('.user-info', 'first')
      .should('be.visible')
      .wait(1000, { log: false })

    cy.session('second user', () => registerUser('second'))
    cy.visit('/rooms')
    cy.contains('.user-info', 'second')
      .should('be.visible')
      .wait(1000, { log: false })

    // back to the first user
    cy.session('first user', () => registerUser('first'))
    cy.visit('/rooms')
    cy.contains('.user-info', 'first')
      .should('be.visible')
      .wait(1000, { log: false })
  })
})
