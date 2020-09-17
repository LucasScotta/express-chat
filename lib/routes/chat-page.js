const express = require('express')
const Chat = require('./chat')()
const chat = new Chat()
chat.createRoom({timeoutInMillis: 30000})

const Message = require('./chat/message')
module.exports = exports = express.Router()


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

exports.get('/message', (req, resp) => {

  const user = req.sesion.user
  const id = req.query.roomId
  const room = chat.getRoom(id)
  if (!room) {
    return resp.sendStatus(400)
  }
  const feed = room.addUser({req, resp}, user)
  feed.start(room)
})

exports.get('/create', (req, resp) => {
  const user = req.sesion.user
  chat.createRoom(user)
  resp.send(200)
})

exports.use('/', (req, resp) => {
  const user = req.sesion.user
  const view = user
    ? './chat/index'
    : './loggin/index'
  const userName = user
    ? user.name
    : null

  resp.render(view, { user: userName }, (err, html) => {
    if (err) {
      resp.sendStatus(500)
      throw err
    }
    return resp.send(html)
  })
})
