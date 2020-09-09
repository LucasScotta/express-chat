const express = require('express')
const Chat = require('./chat')()
const chat = new Chat()

const Message = require('./chat/message')
module.exports = exports = express.Router()

exports.post('/', (req, resp) => {

    const message = req.body.message
    const roomId = req.body.roomId
    if (!roomId) return resp.sendStatus(400)
    if (!chat.getRoom(roomId)) return resp.sendStatus(400)
    if (!message || message === "") return resp.sendStatus(200)

    const data = new Message().create({message, roomId, user: req.sesion.user.name, date: Date.now()})
    chat.sendMessage(data)
    resp.sendStatus(200)
  })

exports.get('/', (req, resp) => {

  const user = req.sesion.user
  const id = req.query.roomId
  const room = chat.getRoom(id)
  if (!room) {
    return resp.sendStatus(400)
  }
  const feed = room.addUser(user)
  feed.start(resp, room)
})

exports.get('/create', (req, resp) => {
  const user = req.sesion.user
  const room = chat.createRoom(user)
  user.ids.push(room.getId())
  resp.send(200)
})
