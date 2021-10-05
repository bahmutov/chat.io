// @ts-check
/// <reference types="cypress-data-session" />

export function createRoom(name = 'basement') {
  return cy.dataSession({
    name,
    setup: () => {
      // yields the new room's ID
      return cy.task('makeRoom', name)
    },
    validate(id) {
      // yields undefined if the room was not found
      // which we convert into a boolean value
      return cy.task('getRoom', id, { log: false }).then(Boolean)
    },
    shareAcrossSpecs: true,
  })
}
