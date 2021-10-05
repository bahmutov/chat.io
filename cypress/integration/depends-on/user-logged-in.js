// @ts-check
/// <reference types="cypress-data-session" />

describe('dependent data sessions', () => {
  beforeEach(() => {
    const username = 'Gleb'
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
        cy.task('findUser', username).then((user) => {
          return {
            username,
            password,
            // @ts-ignore
            id: user._id,
          }
        })
      },
      validate(saved) {
        return cy.task('getUser', saved.id).then((found) => {
          return (
            found &&
            // @ts-ignore
            found.username === saved.username &&
            // @ts-ignore
            found._id === saved.id
          )
        })
      },
    })
  })

  beforeEach(function () {
    const { username, password } = this.user

    cy.dataSession({
      name: 'logged in user',
      setup() {
        cy.visit('/')
        cy.get('.login-form')
          .should('be.visible')
          .within(() => {
            cy.get('[placeholder=username]').type(username)
            cy.get('[placeholder=password]').type(password)
            cy.contains('button', 'login').click()
          })
        cy.location('pathname').should('equal', '/rooms')
        return cy.getCookie('connect.sid').should('exist')
      },
      validate(cookie) {
        return Boolean(cookie)
      },
      recreate(cookie) {
        // if the cookie is valid, we just need to visit the page
        cy.setCookie(cookie.name, cookie.value)
        cy.visit('/rooms')
        // no redirect back to the / means everything is good
        cy.location('pathname').should('equal', '/rooms')
      },
      dependsOn: ['user'],
    })
  })

  it('has valid user', function () {
    cy.task('getUser', this.user.id).should('be.an', 'object')
    cy.location('pathname').should('equal', '/rooms')
    cy.get('.user-info').should('have.text', this.user.username)
  })
})
