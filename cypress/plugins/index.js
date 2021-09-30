// for more, read the blog post
// "Testing Mongo with Cypress"
// https://glebbahmutov.com/blog/testing-mongo-with-cypress/

const database = require('../../app/database')

// if you are not sure about the database, print the models
// console.log('database models', database.models)
// we should have at least two mongoose database models
// { user: ..., room: ... }

async function clearRooms() {
  console.log('clear rooms')
  await database.models.room.deleteMany({})
  return null
}

async function clearUsers() {
  console.log('clear users')
  await database.models.user.deleteMany({})
  return null
}

async function getRooms() {
  console.log('get rooms')
  const found = await database.models.room.find({})
  console.log(found)
  return found
}

async function getRoom(id) {
  console.log('get room with id', id)
  if (typeof id !== 'string') {
    throw new Error('id must be a string')
  }
  return database.models.room.findOne({ _id: id })
}

async function findUser(username) {
  console.log('find user', username)
  if (typeof username !== 'string') {
    throw new Error('username must be a string')
  }
  return database.models.user.findOne({ username })
}

async function makeRoom(title) {
  const newRoom = await database.models.room.create({ title })
  console.log('newRoom', newRoom)
  return newRoom._id
}

module.exports = (on, config) => {
  // https://github.com/bahmutov/cypress-watch-and-reload
  require('cypress-watch-and-reload/plugins')(config)

  // https://github.com/bahmutov/cypress-data-session
  require('cypress-data-session/src/plugin')(on, config)

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

    makeRoom,
    getRooms,
    getRoom,
    findUser,
    clearUsers,
    clearRooms,
  })
}
