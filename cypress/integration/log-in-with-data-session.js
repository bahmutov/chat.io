/// <reference types="cypress-data-session" />

const { random } = Cypress._

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

      cy.contains('button', 'create')
        .click()
        // the app disables the button while submitting the form
        .should('be.disabled')
    })
  // if everything goes well
  cy.contains('.success', 'Your account has been created').should(
    'be.visible',
  )
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

      cy.contains('button', 'login')
        .click()
        // the app disables the button while submitting the form
        .should('be.disabled')
    })
}

beforeEach(() => {
  cy.dataSession({
    name: 'user',
    setup() {
      const username = 'Gleb-' + random(1e3)
      const password = '¡SoSecret!'
      registerUser(username, password)
      cy.wrap({ username, password })
    },
    shareAcrossSpecs: true,
  })
})

beforeEach(function () {
  cy.dataSession({
    name: 'login',
    setup() {
      loginUser(this.user.username, this.user.password)
      cy.getCookie('connect.sid').its('value')
    },
    recreate(value) {
      cy.setCookie('connect.sid', value)
      cy.visit('/')
    },
    shareAcrossSpecs: true,
    dependsOn: ['user'],
  })
})

beforeEach(() => {
  cy.dataSession({
    name: 'roomName',
    setup() {
      const roomName = 'Room-' + random(1e3)
      cy.get('input[aria-label="New room name"]')
        .type(roomName)
        .next()
        .click()
      cy.contains('.room-item', roomName).should('be.visible')
      cy.wrap(roomName)
    },
    shareAcrossSpecs: true,
  })
})

it('uses data session', function () {
  cy.location('pathname').should('equal', '/rooms')
  cy.contains('.user-info', this.user.username)
  cy.contains('.room-item', this.roomName).click()
  cy.location('pathname').should('include', '/chat/')
  cy.contains('.chat-room', this.roomName).should('be.visible')
})
