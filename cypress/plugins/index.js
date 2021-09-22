// for more, read the blog post
// "Testing Mongo with Cypress"
// https://glebbahmutov.com/blog/testing-mongo-with-cypress/

const database = require('../../app/database')

console.log('database models', database.models)
// we should have at least two mongoose database models
// { user: ..., room: ... }

module.exports = (on, config) => {
  on('task', {
    async clearUsers() {
      console.log('clear users')
      await database.models.user.deleteMany({})
      return null
    },

    async clearRooms() {
      console.log('clear rooms')
      await database.models.room.deleteMany({})
      return null
    },
  })
}
