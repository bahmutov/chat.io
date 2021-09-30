// @ts-check
/// <reference types="cypress-data-session" />

describe('log in using cypress-data-session', () => {
  beforeEach(() => {
    const username = 'Gleb-' + Cypress._.random(1e3)
    const password = '¡SoSecret!'
    cy.dataSession({
      name: 'user',
      setup() {
        cy.visit('/').get('#create-account').should('be.visible').click()
        cy.get('.register-form')
          .should('be.visible')
          .within(() => {
            cy.get('[placeholder=username]').type(username)
            cy.get('[placeholder=password]').type(password)
            cy.contains('button', 'create').click()
          })

        // now log in
        cy.get('.login-form')
          .should('be.visible')
          .within(() => {
            cy.get('[placeholder=username]').type(username)
            cy.get('[placeholder=password]').type(password)
            cy.contains('button', 'login').click()
          })
        cy.location('pathname').should('equal', '/rooms')

        // the result of logging in - the user object AND cookie object
        cy.getCookie('connect.sid')
          .should('exist')
          .then((cookie) => {
            return {
              cookie,
              username,
            }
          })
      },
      validate(saved) {
        return cy.task('findUser', saved.username).then(Boolean)
      },
      recreate(saved) {
        cy.setCookie('connect.sid', saved.cookie.value)
        cy.visit('/rooms')
      },
    })
  })

  it('is logged in', function () {
    cy.location('pathname').should('equal', '/rooms')
    cy.contains('.user-info', this.user.username)
  })
})
