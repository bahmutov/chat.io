'use strict'

const fs = require('fs')
var config = require('../config')
var redis = require('redis').createClient
var adapter = require('socket.io-redis')

var Room = require('../models/room')
const Message = require('../models/message')

/**
 * @typedef Message
 * @type {object}
 * @property {string} username - The user name
 * @property {string} content - The message itself
 * @property {Date} date - The date of the message
 */

/**
 * Encapsulates all code for emitting and listening to socket events
 *
 */
var ioEvents = function (io) {
  // Rooms namespace
  io.of('/rooms').on('connection', function (socket) {
    // Create a new room
    socket.on('createRoom', function (title) {
      Room.findOne(
        { title: new RegExp('^' + title + '$', 'i') },
        function (err, room) {
          if (err) throw err
          if (room) {
            socket.emit('updateRoomsList', {
              error: 'Room title already exists.',
            })
          } else {
            Room.create(
              {
                title: title,
              },
              function (err, newRoom) {
                if (err) throw err
                socket.emit('updateRoomsList', newRoom)
                socket.broadcast.emit('updateRoomsList', newRoom)
              },
            )
          }
        },
      )
    })
  })

  // Chatroom namespace
  io.of('/chatroom').on('connection', function (socket) {
    // Join a chatroom
    socket.on('join', function (roomId) {
      Room.findById(roomId, function (err, room) {
        if (err) throw err
        if (!room) {
          // Assuming that you already checked in router that chatroom exists
          // Then, if a room doesn't exist here, return an error to inform the client-side.
          socket.emit('updateUsersList', { error: 'Room does not exist.' })
        } else {
          // Check if user exists in the session
          if (socket.request.session.passport == null) {
            return
          }

          Room.addUser(room, socket, function (err, newRoom) {
            // Join the room channel
            socket.join(newRoom.id)

            Room.getUsers(
              newRoom,
              socket,
              function (err, users, countUsersInRoom) {
                if (err) throw err

                // Return list of all user connected to the room to the current user
                socket.emit('updateUsersList', users, true)

                // Return the current user to other connecting sockets in the room
                // ONLY if the user wasn't connected already to the current room
                if (countUsersInRoom === 1) {
                  socket.broadcast
                    .to(newRoom.id)
                    .emit('updateUsersList', users[users.length - 1])
                }
              },
            )

            Message.findAll(newRoom.id, function (err, messages) {
              if (err) throw err

              // we are only interested in some props
              const msg = messages.map((m) => {
                return {
                  content: m.content,
                  username: m.username,
                  date: m.date,
                }
              })
              console.log('room %s has %d message(s)', newRoom.id, msg.length)
              if (msg.length) {
                console.table(msg)
              }
              socket.emit('roomMessages', msg)
            })
          })
        }
      })
    })

    // When a socket exits
    socket.on('disconnect', function () {
      // Check if user exists in the session
      if (socket.request.session.passport == null) {
        return
      }

      // Find the room to which the socket is connected to,
      // and remove the current user + socket from this room
      Room.removeUser(socket, function (err, room, userId, cuntUserInRoom) {
        if (err) throw err

        // Leave the room channel
        socket.leave(room.id)

        // Return the user id ONLY if the user was connected to the current room using one socket
        // The user id will be then used to remove the user from users list on chatroom page
        if (cuntUserInRoom === 1) {
          socket.broadcast.to(room.id).emit('removeUser', userId)
        }
      })
    })

    // When a new message arrives
    socket.on(
      'newMessage',
      /** @param {Message} message */
      function (roomId, message) {
        // No need to emit 'addMessage' to the current socket
        // As the new message will be added manually in 'main.js' file
        // socket.emit('addMessage', message);

        console.log(
          '%s in room %s says: %s',
          message.username,
          roomId,
          message.content,
        )
        Message.add(
          {
            ...message,
            roomId,
          },
          function (err, newMessage) {
            if (err) {
              console.error('Could not add the new message')
              console.error(err)
              throw err
            }
          },
        )

        socket.broadcast.to(roomId).emit('addMessage', message)
      },
    )
  })
}

/**
 * Initialize Socket.io
 * Uses Redis as Adapter for Socket.io
 *
 */
var init = function (app) {
  const isHttps = process.env.HTTPS === 'true'
  let server
  if (isHttps) {
    const options = {
      // from the working directory
      key: fs.readFileSync('./.cert/key.pem'),
      cert: fs.readFileSync('./.cert/cert.pem'),
    }
    console.log('HTTPS enabled')
    server = require('https').createServer(options, app)

    // const redirecter = express()
    // redirector.all('*', (req, res) => {
    //   res.redirect('https://' + req.headers.host + req.url)
    // })
    // const redirectServer = require('http').Server(redirecter)
    // redirectServer.listen(port)
  } else {
    server = require('http').Server(app)
  }
  var io = require('socket.io')(server)

  // Force Socket.io to ONLY use "websockets"; No Long Polling.
  io.set('transports', ['websocket'])

  // Using Redis
  let port = config.redis.port
  let host = config.redis.host
  let password = config.redis.password
  console.log('Redis info', { host, port, password })
  let pubClient = redis(port, host, { auth_pass: password })
  let subClient = redis(port, host, {
    auth_pass: password,
    return_buffers: true,
  })
  io.adapter(adapter({ pubClient, subClient }))

  // Allow sockets to access session data
  io.use((socket, next) => {
    require('../session')(socket.request, {}, next)
  })

  // Define all Events
  ioEvents(io)

  // The server object will be then used to list to a port number
  return server
}

module.exports = init
