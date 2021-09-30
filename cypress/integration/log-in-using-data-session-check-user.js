// @ts-check
/// <reference types="cypress-data-session" />

describe('login using cypress-data-session (check user first)', () => {
  beforeEach(() => {
    const username = 'Gleb'
    const password = '¡SoSecret!'
    cy.dataSession({
      name: 'user',
      preSetup() {
        // before creating the user with the fixed username
        // check if the user already exists, delete it if it does
        cy.task('findUser', username).then((user) => {
          if (user) {
            // @ts-ignore
            cy.task('deleteUser', user._id)
          }
        })
      },
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
    // looking for exact username match
    cy.get('.user-info').should('have.text', this.user.username)
  })
})
