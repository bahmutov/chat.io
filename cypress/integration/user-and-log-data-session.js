// @ts-check
/// <reference types="cypress-data-session" />

import { loginViaApi } from './utils'

describe('user registration using cy.task', () => {
  it('registers the user', () => {
    cy.task('clearUsers')

    const username = 'Mary'
    const password = 'Secret!'
    cy.task('makeUser', { username, password })

    loginViaApi({ username, password })
    cy.visit('/rooms')
    cy.get('.user-info').should('have.text', username)
  })

  it('creates and registers using data session', () => {
    const username = 'Mike'
    const password = 'Secret!'

    cy.dataSession({
      name: 'Mike',
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
        cy.task('makeUser', { username, password }).then(() => {
          return { username, password }
        })
      },
      validate(saved) {
        return cy.task('findUser', username).then(Boolean)
      },
    })

    loginViaApi({ username, password })
    cy.visit('/rooms')
    cy.get('.user-info').should('have.text', username)
  })

  it('one session to create user, another to log in', () => {
    const username = 'Mike'
    const password = 'NoSecret!'

    cy.dataSession({
      name: 'MikeUser',
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
        Cypress.clearDataSession('Mike is logged in')
        cy.task('makeUser', { username, password }).then((id) => {
          console.log('make user id', id)
          return { username, password, id }
        })
      },
      validate(saved) {
        // validate the user better - because the user
        // with the same username could be there - but not
        // the user we have session cookie for!
        return cy.task('findUser', username).then((user) => {
          if (!user) {
            return false
          }
          // @ts-ignore
          return user._id === saved.id
        })
      },
    })

    cy.dataSession({
      name: 'Mike is logged in',
      setup() {
        loginViaApi({ username, password })
        cy.visit('/rooms')
        cy.getCookie('connect.sid')
          .should('exist')
          .then((cookie) => {
            return cookie.value
          })
      },
      validate(cookieValue) {
        return cy
          .request({
            method: 'GET',
            url: '/rooms',
            followRedirect: false,
            failOnStatusCode: false,
            headers: {
              cookie: `connect.sid=${cookieValue}`,
            },
          })
          .then((res) => {
            // if the response redirects, then
            // the cookie is no longer valid
            return res.status === 200
          })
      },
      recreate(cookieValue) {
        cy.clearCookies()
        cy.setCookie('connect.sid', cookieValue)
        cy.visit('/rooms')
      },
    })

    cy.get('.user-info').should('have.text', username)
  })
})
