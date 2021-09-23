/// <reference types="cypress" />

describe('cy.request command', () => {
  beforeEach(() => {
    cy.task('clearUsers')
    cy.task('clearRooms')
  })

  it('registers the user', () => {
    // registers the user using cy.request API call
    // then logs in using cy.visit + UI
    // https://on.cypress.io/request
    const username = 'Mary'
    const password = 'Secret!'
    cy.request({
      method: 'POST',
      url: '/register',
      form: true,
      body: {
        username,
        password,
      },
    })
    // now enter the user information into the form
    cy.visit('/')
    cy.get('.login-form')
      .should('be.visible')
      .within(() => {
        cy.get('[placeholder=username]').type(username)
        cy.get('[placeholder=password]').type(password)
        cy.contains('button', 'login').click()
      })
    cy.location('pathname').should('equal', '/rooms')
    cy.contains('.user-info', username).should('be.visible')
  })

  it('registers and logs in', () => {
    // registers the user using cy.request API call
    // then visits the page, logs in using the cy.request API call
    // https://on.cypress.io/request
    const username = 'Mary'
    const password = 'Secret!'
    cy.request({
      method: 'POST',
      url: '/register',
      form: true,
      body: {
        username,
        password,
      },
    })
    // visit the page to get the session started
    cy.visit('/')
    cy.request({
      method: 'POST',
      url: '/login',
      form: true,
      body: {
        username,
        password,
      },
    })
    cy.visit('/rooms')
    cy.contains('.user-info', username).should('be.visible')
  })

  it('registers, visits, and logs in', () => {
    // registers the user using cy.request API call
    // visits the page using the cy.request API call
    // logs in using the cy.request API call
    // https://on.cypress.io/request
    const username = 'Mary'
    const password = 'Secret!'
    cy.request({
      method: 'POST',
      url: '/register',
      form: true,
      body: {
        username,
        password,
      },
    })
    // when requesting the page using cy.request,
    // the returned cookies are set too!
    cy.request('/')
    // let's check the session cookie was set
    cy.getCookie('connect.sid').should('exist')
    cy.request({
      method: 'POST',
      url: '/login',
      form: true,
      body: {
        username,
        password,
      },
    })
    cy.visit('/rooms')
    cy.contains('.user-info', username).should('be.visible')
  })

  // do we create a room using a WebSocket message?
  it.skip('registers, visits, logs in, and creates a room', () => {
    // registers the user using cy.request API call
    // visits the page using the cy.request API call
    // logs in using the cy.request API call
    // https://on.cypress.io/request
    const username = 'Mary'
    const password = 'Secret!'
    cy.request({
      method: 'POST',
      url: '/register',
      form: true,
      body: {
        username,
        password,
      },
    })
    // when requesting the page using cy.request,
    // the returned cookies are set too!
    cy.request('/')
    // let's check the session cookie was set
    cy.getCookie('connect.sid').should('exist')
    cy.request({
      method: 'POST',
      url: '/login',
      form: true,
      body: {
        username,
        password,
      },
    })
    // now let's create a room
    cy.cy.visit('/rooms')
    cy.contains('.user-info', username).should('be.visible')
  })
})
