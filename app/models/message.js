'use strict'

const messageModel = require('../database').models.message

const add = function (data, callback) {
  const newMessage = new messageModel(data)
  newMessage.save(callback)
}

const findAll = function (roomId, callback) {
  messageModel.find({ roomId }, callback)
}

module.exports = {
  add,
  findAll,
}
