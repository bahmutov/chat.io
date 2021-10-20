/// <reference types="cypress" />

function registerUser(username, password) {
  cy.visit('/')

  cy.get('#create-account').should('be.visible').click()
  cy.get('.register-form')
    .should('be.visible')
    .within(() => {
      cy.get('[placeholder=username]')
        .type(username)
        .should('have.value', username)
      cy.get('[placeholder=password]').type(password)

      cy.contains('button', 'create').click()
    })
  // if everything goes well
  cy.contains('.success', 'Your account has been created').should('be.visible')
}

function registerApi(username, password) {
  cy.request({
    method: 'POST',
    url: '/register',
    form: true,
    body: {
      username,
      password,
    },
  })
}

function loginUser(username, password) {
  cy.visit('/')

  cy.get('.login-form')
    .should('be.visible')
    .within(() => {
      cy.get('[placeholder=username]')
        .type(username)
        .should('have.value', username)
      cy.get('[placeholder=password]').type(password)

      cy.contains('button', 'login').click()
    })
}

it.skip('registers user 1', () => {
  const username = 'Test'
  const password = 'MySecreT'

  cy.task('clearUsers')
  registerUser(username, password)
  loginUser(username, password)

  // if the user has been created and could log in
  // we should be redirected to the home page with the rooms
  cy.location('pathname').should('equal', '/rooms')
})

it.skip('registers user 2', () => {
  const username = 'Test'
  const password = 'MySecreT'

  cy.task('findUser', username).then((user) => {
    if (!user) {
      registerUser(username, password)
    }
  })
  loginUser(username, password)

  // if the user has been created and could log in
  // we should be redirected to the home page with the rooms
  cy.location('pathname').should('equal', '/rooms')
})

it('registers user using data session 1', () => {
  const username = 'Test'
  const password = 'MySecreT'

  cy.dataSession({
    name: 'user',
    setup() {
      registerUser(username, password)
    },
  })
  loginUser(username, password)

  // if the user has been created and could log in
  // we should be redirected to the home page with the rooms
  cy.location('pathname').should('equal', '/rooms')
})

it('registers user using data session 2', () => {
  const username = 'Test'
  const password = 'MySecreT'

  cy.dataSession({
    name: 'user',
    setup() {
      registerUser(username, password)
    },
    validate() {
      return cy.task('findUser', username).then(Boolean)
    },
  })
  loginUser(username, password)

  // if the user has been created and could log in
  // we should be redirected to the home page with the rooms
  cy.location('pathname').should('equal', '/rooms')
})

it('registers user using data session 3', () => {
  const username = 'Test'
  const password = 'MySecreT'

  cy.dataSession({
    name: 'user',
    setup() {
      registerApi(username, password)
    },
    validate() {
      return cy.task('findUser', username).then(Boolean)
    },
  })
  loginUser(username, password)

  // if the user has been created and could log in
  // we should be redirected to the home page with the rooms
  cy.location('pathname').should('equal', '/rooms')
})

it('registers user using data session 4', () => {
  const username = 'Test'
  const password = 'MySecreT'

  cy.dataSession({
    name: 'user',
    setup() {
      cy.task('makeUser', { username, password })
    },
    validate() {
      return cy.task('findUser', username).then(Boolean)
    },
  })
  loginUser(username, password)

  // if the user has been created and could log in
  // we should be redirected to the home page with the rooms
  cy.location('pathname').should('equal', '/rooms')
})

export const loginViaApi = (username, password) => {
  cy.log(`log in user **${username}**`)
  cy.request({
    method: 'POST',
    url: '/login',
    form: true,
    body: {
      username,
      password,
    },
  })
  // after cy.request, the cookie should exist in the browser
  return cy.getCookie('connect.sid')
}

it('register and log in using cy.request', () => {
  const username = 'Test'
  const password = 'MySecreT'

  cy.dataSession({
    name: 'user',
    setup() {
      cy.task('makeUser', { username, password }).then((id) => {
        return { id, username, password }
      })
    },
    validate({ id }) {
      return cy.task('getUser', id).then(Boolean)
    },
  })

  cy.get('@user')
    .should('have.property', 'username', username)
    // or access the alias using the test context property
    // after it has been set
    .then(function () {
      expect(this.user).to.have.keys('id', 'username', 'password')
    })

  loginViaApi(username, password)

  // if the user is logged in correctly,
  // the session cookie is set, and when we visit the page
  // we are automatically redirected to the list of chat rooms
  cy.visit('/')
  cy.location('pathname').should('equal', '/rooms')
})

it('register and log in using data sessions', () => {
  const username = 'Test'
  const password = 'MySecreT'

  cy.dataSession({
    name: 'user',
    setup() {
      cy.task('makeUser', { username, password }).then((id) => {
        return { id, username, password }
      })
    },
    validate({ id }) {
      return cy.task('getUser', id).then(Boolean)
    },
  })

  cy.dataSession({
    name: 'logged in user',
    setup() {
      // yields the connect.sid cookie
      return loginViaApi(username, password)
    },
    // any non-null cookie value is valid
    validate: true,
    // if we have the previous valid cookie
    // set it in the browser before any cy.visit
    recreate(cookie) {
      cy.setCookie('connect.sid', cookie.value)
    },
  })

  // if the user is logged in correctly,
  // the session cookie is set, and when we visit the page
  // we are automatically redirected to the list of chat rooms
  cy.visit('/')
  cy.location('pathname').should('equal', '/rooms')
})

it.only('clear session', () => {
  const username = 'Test'
  const password = 'MySecreT'

  cy.dataSession({
    name: 'user',
    preSetup() {
      return cy.task('clearUsers')
    },
    setup() {
      cy.task('makeUser', { username, password }).then((id) => {
        return { id, username, password }
      })
    },
    validate({ id }) {
      return cy.task('getUser', id).then(Boolean)
    },
  })

  cy.dataSession({
    name: 'logged in user',
    dependsOn: ['user'],
    setup() {
      // yields the connect.sid cookie
      return loginViaApi(username, password)
    },
    // any non-null cookie value is valid
    validate: true,
    // if we have the previous valid cookie
    // set it in the browser before any cy.visit
    recreate(cookie) {
      cy.setCookie('connect.sid', cookie.value)
    },
  })

  // if the user is logged in correctly,
  // the session cookie is set, and when we visit the page
  // we are automatically redirected to the list of chat rooms
  cy.visit('/')
  cy.location('pathname').should('equal', '/rooms')
})
