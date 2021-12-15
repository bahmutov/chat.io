// cy.dataSession demo tests from the presentation
// https://slides.com/bahmutov/cypress-plugins
// and the blog post "Faster User Object Creation"
// https://glebbahmutov.com/blog/faster-user-creation/
// thus some functions are duplicated from other test files for demo purposes

/// <reference types="cypress" />

/**
 * A function that visits the page and creates the new user by submitting a form.
 * @param {string} username - the username to use
 * @param {string} password - the password to use
 */
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

      cy.contains('button', 'create').click().should('be.disabled')
    })
  // if everything goes well
  cy.contains('.success', 'Your account has been created').should('be.visible')
}

/**
 * Opens the page, enters the username and password and clicks the login button.
 * If the login is successful, the browser should redirect to the rooms page.
 * @param {string} username Existing user name
 * @param {string} password The password to use
 */
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
      cy.location('pathname').should('equal', '/rooms')
    })
}

// if you need to clear the users from the browser's DevTools run:
// cy.now('task', 'clearUsers')

// will fail if the user already exists in the database
it.skip('registers and logs in via UI', () => {
  const username = 'Test'
  const password = 'MySecreT'
  registerUser(username, password)
  loginUser(username, password)
  // check if the user is logged in successfully
  cy.location('pathname').should('equal', '/rooms')
  cy.contains('.user-info', 'Test').should('be.visible')
})

// slow, deletes all users unnecessarily
it.skip('deletes all users before registering', () => {
  cy.task('clearUsers')
  const username = 'Test'
  const password = 'MySecreT'
  registerUser(username, password)
  loginUser(username, password)
  // check if the user is logged in successfully
  cy.location('pathname').should('equal', '/rooms')
  cy.contains('.user-info', 'Test').should('be.visible')
})

// does not handle the case when the user is already in the database
// but the data session is not yet created
it.skip('cache the created user', () => {
  const username = 'Test'
  const password = 'MySecreT'
  cy.dataSession({
    name: 'user',
    setup() {
      registerUser(username, password)
    },
    // as long as there is something in memory
    // we know we have created the user already
    validate: true,
  })
  loginUser(username, password)
  // check if the user is logged in successfully
  cy.location('pathname').should('equal', '/rooms')
  cy.contains('.user-info', 'Test').should('be.visible')
})

// works, but always does login via the page (slow)
it.skip('cache the created user with init', () => {
  const username = 'Test'
  const password = 'MySecreT'
  cy.dataSession({
    name: 'user',
    // if there is nothing in memory for the session
    // try pulling the user from the database
    init() {
      cy.task('findUser', username)
    },
    setup() {
      registerUser(username, password)
    },
    // as long as there is something in memory
    // we know we have created the user already
    validate: true,
  })
  loginUser(username, password)
  // check if the user is logged in successfully
  cy.location('pathname').should('equal', '/rooms')
  cy.contains('.user-info', 'Test').should('be.visible')
})

// all good, but does not specify the dependency between the sessions
it.skip('cache the user cookie', () => {
  const username = 'Test'
  const password = 'MySecreT'
  cy.dataSession({
    name: 'user',
    // if there is nothing in memory for the session
    // try pulling the user from the database
    init() {
      cy.task('findUser', username)
    },
    setup() {
      registerUser(username, password)
    },
    // as long as there is something in memory
    // we know we have created the user already
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
  })
  // check if the user is logged in successfully
  cy.location('pathname').should('equal', '/rooms')
  cy.contains('.user-info', 'Test').should('be.visible')
})

// good, but does not validate the data
it.skip('registers user', () => {
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

// does not validate the cookie
it.skip('validates the user', () => {
  const username = 'Test'
  const password = 'MySecreT'

  cy.dataSession({
    name: 'user',
    init() {
      cy.task('findUser', username)
    },
    setup() {
      registerUser(username, password)
      cy.task('findUser', username)
    },
    validate(user) {
      cy.task('findUser', user.username).then(
        (found) => found && found._id === user._id,
      )
    },
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

it('validates the user and the session cookie', { tags: '@demo' }, () => {
  const username = 'Test'
  const password = 'MySecreT'

  cy.dataSession({
    name: 'user',
    init() {
      cy.task('findUser', username)
    },
    setup() {
      registerUser(username, password)
      cy.task('findUser', username)
    },
    validate(user) {
      cy.task('findUser', user.username).then(
        (found) => found && found._id === user._id,
      )
    },
  })
  cy.dataSession({
    name: 'logged in',
    setup() {
      loginUser(username, password)
      cy.getCookie('connect.sid')
    },
    validate(cookie) {
      // try making a request with the cookie value
      // to a protected route. If it is successful
      // we are good to go. If we get a redirect
      // to login instead, we know the cookie is invalid
      cy.request({
        url: '/rooms',
        failOnStatusCode: false,
        followRedirect: false,
        headers: {
          cookie: `connect.sid=${cookie.value}`,
        },
      })
        .its('status')
        .then((status) => status === 200)
    },
    recreate(cookie) {
      cy.setCookie('connect.sid', cookie.value)
      cy.visit('/rooms')
    },
    dependsOn: ['user'],
  })

  // check if the user is logged in successfully
  cy.location('pathname').should('equal', '/rooms')
})
