// for more, read the blog post
// "Testing Mongo with Cypress"
// https://glebbahmutov.com/blog/testing-mongo-with-cypress/

const database = require('../../app/database')

// if you are not sure about the database, print the models
// console.log('database models', database.models)
// we should have at least two mongoose database models
// { user: ..., room: ... }

module.exports = (on, config) => {
  on('task', {
    async getUsers() {
      console.log('getUsers')
      const docs = await database.models.user.find({})
      const users = docs.map((doc) => {
        return {
          username: doc.username,
          password: doc.password,
        }
      })
      console.table(users)
      return users
    },

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
