'use strict'

const Mongoose = require('mongoose')

/**
 * Each message belongs to a room.
 */
const MessageSchema = new Mongoose.Schema({
  content: { type: String, required: true },
  username: { type: String, required: true },
  date: { type: Date, required: true },
  roomId: { type: Mongoose.Schema.Types.ObjectId, required: true },
})

const messageModel = Mongoose.model('message', MessageSchema)

module.exports = messageModel
