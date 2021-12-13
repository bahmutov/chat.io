// cy.dataSession demo tests from the presentation
// https://slides.com/bahmutov/cypress-plugins
// thus some functions are duplicated from other test files for demo purposes

/// <reference types="cypress" />

function registerUser(username, password) {
  cy.visit('/')

  cy.get('#create-account').should('be.visible').click()
  cy.get('.register-form')
    .should('be.visible')
    .within(() => {
      cy.get('[placeholder=username]')
        .type(username, { delay: 100 })
        .should('have.value', username)
      cy.get('[placeholder=password]').type(password, { delay: 100 })

      cy.contains('button', 'create').click()
    })
  // if everything goes well
  cy.contains('.success', 'Your account has been created').should('be.visible')
}

function loginUser(username, password) {
  cy.visit('/')

  cy.get('.login-form')
    .should('be.visible')
    .within(() => {
      cy.get('[placeholder=username]')
        .type(username, { delay: 100 })
        .should('have.value', username)
      cy.get('[placeholder=password]').type(password, { delay: 100 })

      cy.contains('button', 'login').click()
    })
}

// if you need to clear the users from the browser's DevTools run:
// cy.now('task', 'clearUsers')
it('registers user', { tags: '@demo' }, () => {
  const username = 'Test'
  const password = 'MySecreT'

  cy.dataSession({
    name: 'user',
    init() {
      cy.task('findUser', username)
    },
    setup() {
      registerUser(username, password)
    },
    validate: true,
  })
  cy.dataSession({
    name: 'logged in',
    setup() {
      loginUser(username, password)
      cy.getCookie('connect.sid')
    },
    validate: true,
    recreate(cookie) {
      cy.setCookie('connect.sid', cookie.value)
      cy.visit('/rooms')
    },
    dependsOn: ['user'],
  })

  // check if the user is logged in successfully
  cy.location('pathname').should('equal', '/rooms')
})
