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

let username
let password

beforeEach(() => {
  username = Cypress.env('username')
  password = Cypress.env('password')
  if (!username) {
    username = 'Gleb-' + Cypress._.random(1e3)
    password = '¡SoSecret!'
    Cypress.env('username', username)
    Cypress.env('password', password)
    registerUser(username, password)
  }
})

beforeEach(() => {
  if (Cypress.env('cookie')) {
    cy.setCookie('connect.sid', Cypress.env('cookie'))
    cy.visit('')
  } else {
    loginUser(username, password)
    cy.getCookie('connect.sid').then((cookie) => {
      Cypress.env('cookie', cookie.value)
    })
  }
})

beforeEach(() => {
  if (!Cypress.env('room')) {
    const roomName = 'Room-' + Cypress._.random(1e3)
    cy.get('input[aria-label="New room name"]')
      .type(roomName)
      .next()
      .click()
    cy.contains('.room-item', roomName).should('be.visible')
    Cypress.env('room', roomName)
    cy.wrap(roomName).as('roomName')
  } else {
    // need to set the alias before each test
    cy.wrap(Cypress.env('room')).as('roomName')
  }
})

it('logs in using a cookie', function () {
  cy.location('pathname').should('equal', '/rooms')
  cy.contains('.user-info', username)
  cy.contains('.room-item', this.roomName).click()
  cy.location('pathname').should('include', '/chat/')
  cy.contains('.chat-room', this.roomName).should('be.visible')
})
