'use strict'

const Mongoose = require('mongoose')

// Connect to the database
const dbURI = process.env.MONGODB
if (!dbURI) {
  throw new Error('Missing MONGODB')
}
Mongoose.connect(dbURI, { useNewUrlParser: true })

// Throw an error if the connection fails
Mongoose.connection.on('error', function (err) {
  if (err) throw err
})

// mpromise (mongoose's default promise library) is deprecated,
// Plug-in your own promise library instead.
// Use native promises
Mongoose.Promise = global.Promise

module.exports = {
  Mongoose,
  models: {
    user: require('./schemas/user.js'),
    room: require('./schemas/room.js'),
    message: require('./schemas/message.js'),
  },
}
