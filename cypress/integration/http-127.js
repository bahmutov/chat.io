/// <reference types="cypress" />

if (Cypress.env('HTTPS')) {
  context('HTTP -> HTTPS redirects', () => {
    describe('local IP', { baseUrl: 'http://127.0.0.1:3001' }, () => {
      it('loads', () => {
        cy.visit('/')
        cy.get('.login-page').should('be.visible')
        cy.location('protocol').should('eq', 'https:')
      })
    })

    describe('localhost', { baseUrl: 'http://localhost:3001' }, () => {
      it('loads', () => {
        cy.visit('/')
        cy.get('.login-page').should('be.visible')
        cy.location('protocol').should('eq', 'https:')
      })
    })
  })
} else {
  it('works in HTTP', () => {
    cy.visit('/')
    cy.location('protocol').should('eq', 'http:')
  })
}
