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
      return cy.task('getRoom', id, { log: false })
    },
    shareAcrossSpecs: true,
  })
}
