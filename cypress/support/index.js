/// <reference types="cypress" />

// add 1 second pause after each test
// to make sure the CI video has a chance to finish
afterEach(() => {
  cy.wait(1000, { log: false })
})
