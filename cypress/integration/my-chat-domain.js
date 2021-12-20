/// <reference types="cypress" />

describe('custom domain', { baseUrl: 'http://my-chat.io:3000' }, () => {
  it('loads thanks to hosts config option', () => {
    // see cypress.json file
    // where we define hosts to include record
    // "my-chat.io": "127.0.0.1"
    cy.visit('/')
    cy.get('.login-page').should('be.visible')
  })
})
