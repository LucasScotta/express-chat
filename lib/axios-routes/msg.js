const express = require('express')
const Chat = require('./chat')()
const util = require('./chat/util')
const chat = new Chat
chat.createRoom({name:''})
module.exports = exports = express.Router()

exports.post('/', (req, resp) => {
    if (!req.sesion.user.name) {
      return resp.sendStatus(417)
    }

    const message = req.body.message
    const id = req.body.roomId
    if (!message || !id || message === "") return resp.sendStatus(200)


    chat.sendMessage({
      message,
      name: req.sesion.user.name,
    }, id)
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
    feed.on('send-message', (message) => {
      resp.send(message)
      room.removeFeed(feed)
    })
    feed.on('timeout', () => {
      resp.sendStatus(200)
      feed.stop()
    })
    setTimeout(() => feed.emit('timeout'), util.maxWait * 1000)
    // feed.start()
  })
