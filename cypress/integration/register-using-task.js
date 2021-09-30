// @ts-check
/// <reference types="cypress-data-session" />

import { loginViaApi } from './utils'

describe('user registration using cy.task', () => {
  it.only('registers the user', () => {
    cy.task('clearUsers')

    const username = 'Mary'
    const password = 'Secret!'
    cy.task('makeUser', { username, password })

    loginViaApi({ username, password })
    cy.visit('/rooms')
    cy.get('.user-info').should('have.text', username)
  })

  it('creates and registers using data session', () => {
    const username = 'Mary'
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
})
