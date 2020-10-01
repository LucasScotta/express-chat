const express = require('express')
const Chat = require('./chat')()
const chat = new Chat()
const timeout = {timeoutInMillis: 30000}
chat.readRooms(timeout, () => {})
const Message = require('./chat/message')
module.exports = exports = express.Router()
const config = require('../config')
const status = require('./status')
const users = require('../users')(config.user)

exports.post('/mute', (req, resp) => {
  const user = req.sesion.user
  const userToMute = req.body.userToMute
  if (userToMute) {
    users.mute(user.name, userToMute, (err, mutedUsers) => {
      if (err) {
        return resp.sendStatus(200)
      }
      for (const muted of mutedUsers) {
        if (muted === userToMute) {
          return resp.send({status: status.muted})
        }
      }
      resp.send({status: status.unmuted})
    })
  }

})
exports.post('/message', (req, resp) => {
  const message = req.body.message
  const roomId = req.body.roomId
  if (!roomId) return resp.sendStatus(400)
  if (!chat.getRoom(roomId)) return resp.sendStatus(400)
  if (!message || message === "") return resp.sendStatus(200)

  const data = new Message().create({message, roomId, user: req.sesion.user.name, date: Date.now()})
  chat.sendMessage(data)
  resp.sendStatus(200)
})

exports.get('/debug', (req, resp) => {
  console.log(chat.getRooms())
  console.log('--------------------------------------------------')
  resp.sendStatus(200)
})

exports.get('/message', (req, resp) => {

  const user = req.sesion.user
  const id = req.query.roomId
  const room = chat.getRoom(id)
  if (!room) {
    return resp.sendStatus(400)
  }
  const feed = room.addUser(user)

  feed.on('message', (message) => {
    users.getMuted(user.name, (err, mutedUsers) => {
      if (err) {
        resp.sendStatus(200)
        throw err
      }
      else {
        const found = mutedUsers.some(muted => muted === message.user)
        if (found) {
          resp.sendStatus(200)
        }
        else {
          resp.send(message)
        }
      }
    })
    feed.stop()
  })

  feed.on('timeout', () => {
    resp.sendStatus(200)
    feed.stop(true)
  })

  feed.start()
})

exports.get('/create', (req, resp) => {
  resp.render('./chat/create/index', {err:null}, (err, html) => {
    if (err) {
      resp.sendStatus(500)
      throw err
    }
    return resp.send(html)
  })
})

exports.post('/create', (req, resp) => {
  const user = req.sesion.user
  const invite = req.body.user
  const description = req.body.desciption
  if (user.name === invite) {
    resp.render('./chat/create/index', {err: 'Debes invitar a alguien a la conversacion'}, (err,html) => {
      if (err) {
        resp.sendStatus(500)
        throw err
      }
      return resp.send(html)
    })
  }
  else {
    chat.createRoom(timeout, user.name, description, err => {
      if (err) {
        resp.render('./chat/create/index', {err}, (err, html) => {
          if (err) {
            resp.sendStatus(500)
            throw err
          }
          return resp.send(html)
        })
      }
      resp.redirect('/')
    })
  }
})


exports.use('/', (req, resp) => {
  const user = req.sesion.user
  const view = './chat/index'
  const userName = user.name
  const suscriptors = chat.getRoom(1).getSuscriptors()
  const suscribed = []
  chat.getRooms().forEach(room => {
    if (room.isSuscriptor(user.name)) {
      suscribed.push(room.getDisplayMessage() || room.getId())
    }
  })
  resp.render(view, { user: userName, suscriptors, suscribed }, (err, html) => {
    if (err) {
      resp.sendStatus(500)
      throw err
    }
    return resp.send(html)
  })
})
