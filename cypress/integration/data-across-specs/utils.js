/// <reference types="cypress-data-session" />

export function createRoom() {
  return cy.dataSession({
    name: 'basement',
    setup: () => {
      return cy.task('makeRoom', 'basement')
    },
    validate(id) {
      return cy.task('getRoom', id, { log: false })
    },
    shareAcrossSpecs: true,
  })
}

export function createUser() {
  return cy.dataSession({
    name: 'Joe',
    setup() {
      const username = 'Joe'
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
              return { id, username, password }
            })
        })
    },
    validate(user) {
      console.log('validating', user)
      return cy.task('findUser', user.username).then((found) => {
        return found && found._id === user.id
      })
    },
    shareAcrossSpecs: true,
  })
}