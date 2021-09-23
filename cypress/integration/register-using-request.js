/// <reference types="cypress" />

import { registerUser, registerViaApi } from './utils'

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

  it('is faster than UI', () => {
    const start = Date.now()
    registerUser('John').then(() => {
      const end = Date.now()
      cy.log(`UI took **${end - start}ms**`)
    })

    // log out
    cy.clearCookies().then(() => {
      const start2 = Date.now()
      registerViaApi('Api')
      // we need to visit the page to be kind of
      // the same to the UI registration commands
      // that end on the /rooms page
      cy.visit('/rooms')
      cy.location('pathname')
        .should('equal', '/rooms')
        .then(() => {
          const end = Date.now()
          cy.log(`API took **${end - start2}ms**`)
        })
    })
  })

  it('registers, visits, logs in, and creates a room', () => {
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
    cy.task('makeRoom', 'my own room').then((roomId) => {
      cy.visit('/chat/' + roomId)
      cy.contains('.about .name', username).should('be.visible')
      cy.contains('.chat-room', 'my own room').should('be.visible')
    })
  })
})
