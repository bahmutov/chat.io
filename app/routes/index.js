'use strict'

var express = require('express')
var router = express.Router()
var passport = require('passport')

var User = require('../models/user')
var Room = require('../models/room')

// Home page
router.get('/', function (req, res, next) {
  // If user is already logged in, then redirect to rooms page
  if (req.isAuthenticated()) {
    res.redirect('/rooms')
  } else {
    res.render('login', {
      success: req.flash('success')[0],
      errors: req.flash('error'),
      showRegisterForm: req.flash('showRegisterForm')[0],
    })
  }
})

// Login
// https://www.passportjs.org/docs/authenticate/
// router.post(
//   '/login',
//   passport.authenticate('local', {
//     successRedirect: '/rooms',
//     failureRedirect: '/',
//     failureFlash: true,
//   }),
// )
// explicit route to print the login info
router.post('/login', function (req, res, next) {
  // debugging the login problem
  console.log('/login %s', req.body.username)
  // console.log(req.body)

  passport.authenticate('local', function (err, user, info) {
    if (err) {
      console.error(err)
      return next(err)
    }
    if (!user) {
      console.error('no user')
      console.error(info)
      req.flash('error', 'Incorrect username or password')
      req.flash('showRegisterForm', true)
      return res.redirect('/')
    }
    req.logIn(user, function (err) {
      if (err) {
        console.error('problem logging the user')
        console.error(err)
        return next(err)
      }

      // add a synthetic delay to simulate a slow connection
      setTimeout(function () {
        res.redirect('/rooms')
      }, 1000)
    })
  })(req, res, next)
})

// Register via username and password
router.post('/register', function (req, res, next) {
  const credentials = {
    username: req.body.username,
    password: req.body.password,
  }
  console.log('/register %s', credentials.username)
  // debugging a user registration problem
  // console.log(credentials)

  if (credentials.username === '' || credentials.password === '') {
    console.error('Missing credentials')
    req.flash('error', 'Missing credentials')
    req.flash('showRegisterForm', true)
    res.redirect('/')
    return
  }

  User.registerUser(credentials).then((errorMessageMaybe) => {
    if (typeof errorMessageMaybe === 'string') {
      console.error(errorMessageMaybe)
      req.flash('error', errorMessageMaybe)
      req.flash('showRegisterForm', true)
      res.redirect('/')
      return
    }

    // add a synthetic delay to simulate a slow connection
    setTimeout(function () {
      console.error('Successful registration')
      req.flash('success', 'Your account has been created. Please log in.')
      res.redirect('/')
    }, 1000)
  })
})

// Rooms
router.get('/rooms', [
  User.isAuthenticated,
  function (req, res, next) {
    Room.find(function (err, rooms) {
      if (err) throw err
      res.render('rooms', { user: req.user, rooms })
    })
  },
])

// Chat Room
router.get('/chat/:id', [
  User.isAuthenticated,
  function (req, res, next) {
    console.log('request params', req.params)
    const roomId = req.params.id
    Room.findById(roomId, function (err, room) {
      if (err) {
        console.error('Error finding the room: %s', roomId)
        req.flash('error', 'Error finding the room')
        return res.redirect('/rooms')
      }
      if (!room) {
        console.error('Could not find the room: %s', roomId)
        req.flash('error', 'Could not find the room')
        return res.redirect('/rooms')
      }
      res.render('chatroom', { user: req.user, room: room })
    })
  },
])

// Logout
router.get('/logout', function (req, res, next) {
  // remove the req.user property and clear the login session
  req.logout()

  // destroy session data
  req.session = null

  // redirect to homepage
  res.redirect('/')
})

module.exports = router
