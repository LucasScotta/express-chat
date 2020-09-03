const express = require('express')
const Chat = require('./chat')()
const chat = new Chat()
chat.createRoom({name:''})
const Message = require('./chat/message')
module.exports = exports = express.Router()

exports.post('/', (req, resp) => {
    if (!req.sesion.user.name) {
      return resp.sendStatus(417)
    }

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
    if (!req.sesion.user) {
      return resp.send({ url: '/api/login' })
    }
    const room = chat.getRoom(req.query.roomId)
    if (!room) {
      return resp.sendStatus(400)
    }

    const feed = room.addUser(req.sesion.user.name)
    feed.on('message', (message) => {
      resp.send(message)
      feed.stop()
      room.removeFeed(feed)
    })
    feed.on('timeout', () => {
      resp.sendStatus(200)
      feed.stop()
    })
  })
