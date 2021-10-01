// @ts-check
'use strict'

var userModel = require('../database').models.user

var create = function (data, callback) {
  var newUser = new userModel(data)
  newUser.save(callback)
}

var findOne = function (data, callback) {
  userModel.findOne(data, callback)
}

var findById = function (id, callback) {
  userModel.findById(id, callback)
}

/**
 * A middleware allows user to get access to pages ONLY if the user is already logged in.
 *
 */
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/')
  }
}

async function registerUser(credentials) {
  if (!credentials) {
    throw new Error('Missing credentials')
  }

  if (!credentials.username) {
    throw new Error('Missing username')
  }

  if (!credentials.password) {
    throw new Error('Missing password')
  }

  // Check if the username already exists
  const user = await userModel
    .findOne({
      username: new RegExp('^' + credentials.username + '$', 'i'),
    })
    .exec()

  if (user) {
    console.log(user)
    return 'Username already exists.'
  }

  const newUser = await userModel.create(credentials)
  return newUser
}

module.exports = {
  create,
  findOne,
  findById,
  isAuthenticated,
  registerUser,
}
