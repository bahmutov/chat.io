/// <reference types="cypress" />

// https://github.com/bahmutov/cypress-watch-and-reload
require('cypress-watch-and-reload/support')

// The predicate "validate" function checks the cached data
// against the current data to determine if we need to re-run
// the setup commands.
Cypress.Commands.add('dataSession', (name, setup, validate) => {
  const dataKey = 'dataSession:' + name

  const setupAndSaveData = () => {
    cy.then(setup).then((data) => {
      if (data === undefined) {
        throw new Error('dataSession cannot yield undefined')
      }
      // save the data for this session
      Cypress.env(dataKey, data)
    })
  }

  if (Cypress.env('dataSessions') === false) {
    cy.log('dataSessions disabled')
    return setupAndSaveData()
  }

  cy.log(`dataSession **${name}**`)
  const value = Cypress.env(dataKey)
  if (value === undefined) {
    cy.log(`first time for session **${name}**`)
    return setupAndSaveData()
  }

  cy.then(() => validate(value)).then((valid) => {
    if (valid) {
      cy.log(`data **${name}** is still valid`)
      cy.wrap(value, { log: false })
      return
    }

    cy.log(`recompute data for **${name}**`)
    // TODO: validate the value yielded by the setup
    return setupAndSaveData()
  })
})

// add a simple method to clear data for a specific session
Cypress.clearDataSession = (name) => {
  const dataKey = 'dataSession:' + name
  Cypress.env(dataKey, undefined)
  console.log('cleared data session "%s"', name)
}

// enable or disable data sessions
Cypress.dataSessions = (enable) => {
  Cypress.env('dataSessions', Boolean(enable))
}

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
