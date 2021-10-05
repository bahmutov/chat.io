// @ts-check
/// <reference types="cypress-data-session" />

export function createRoom(name = 'basement') {
  return cy.dataSession({
    name,
    setup: () => {
      // yields the new room's ID
      return cy.task('makeRoom', name).then((roomId) => {
        cy.log(`Made room with ID ${roomId}`)
      })
    },
    validate(id) {
      // yields undefined if the room was not found
      return cy.task('getRoom', id, { log: false })
    },
    shareAcrossSpecs: true,
  })
}

export function createUser(username = 'Joe') {
  return cy.dataSession({
    name: `user ${username}`,
    setup() {
      const password = 'password!'
      return cy
        .request({
          method: 'POST',
          url: '/register',
          form: true,
          body: {
            username,
            password,
          },
        })
        .then(() => {
          return cy
            .task('findUser', username)
            .its('_id')
            .then((id) => {
              cy.log(`Created user ${username} with ID ${id}`)
              // do not return anything to allow the next callback
              // to receive the user's ID
            })
            .then((id) => {
              return { id, username, password }
            })
        })
    },
    validate(user) {
      cy.log(`validating user with ID ${user.id}`)
      return cy.task('findUser', user.username).then((found) => {
        return (
          found &&
          // @ts-ignore
          found._id === user.id
        )
      })
    },
    shareAcrossSpecs: true,
  })
}
