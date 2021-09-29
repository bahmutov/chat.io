/// <reference types="cypress" />

// https://github.com/bahmutov/cypress-watch-and-reload
require('cypress-watch-and-reload/support')

require('cypress-data-session')

// add 1 second pause after each test
// to make sure the CI video has a chance to finish
afterEach(() => {
  // this is how we check if we are running
  // in the interactive mode "cypress open"
  // or in the CI mode using "cypress run"
  if (!Cypress.config('isInteractive')) {
    cy.wait(1000, { log: false })
  }
})
