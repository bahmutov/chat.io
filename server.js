'use strict'

// Chat application dependencies
var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var flash = require('connect-flash')
const http = require('http')

// Chat application components
var routes = require('./app/routes')
var session = require('./app/session')
var passport = require('./app/auth')
var logger = require('./app/logger')

// Set the port number
const port = parseInt(process.env.PORT) || 3000

var ioServer = require('./app/socket')(app, port)

// View engine setup
app.set('views', path.join(__dirname, 'app/views'))
app.set('view engine', 'ejs')

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

app.use(session)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

if (process.env.HTTPS === 'true') {
  const red = express()
  red.use('*', (req, res, next) => {
    console.log('%s %s', req.protocol, req.originalUrl)
    if (req.protocol !== 'https') {
      return res.redirect('https://localhost:' + port + req.originalUrl)
    }
    next()
  })

  const redServer = http.createServer(red)
  redServer.listen(port + 1, () => {
    console.log('redirect port', port + 1)
  })
}

app.use('/', routes)

// Middleware to catch 404 errors
app.use(function (req, res, next) {
  res.status(404).sendFile(process.cwd() + '/app/views/404.htm')
})

ioServer.listen(port)
