const express = require('express')
const Chat = require('./chat')()
const chat = new Chat
module.exports = exports = express.Router()

exports.post('/', (req, resp) => {
    if (!req.sesion.user.name) {
      return resp.sendStatus(417)
    }

    const msg = req.body.msg

    if (msg === "") resp.sendStatus(200)
    else {
      /*chat.sendMsg({
        msg,
        name: req.sesion.user.name,
      })*/
      resp.sendStatus(200)
    }
  })

exports.get('/', (req, resp) => {
    if (!req.sesion.user) {
      return resp.send({ url: '/api/login' })
    }

    const room = chat.getRoom(req.query.roomId)
    if (!room) {
      return resp.send(400)
    }

    const feed = room.addUser(req.sesion.user.name)
    feed.on('msg', (msg) => {
      resp.send([msg])
      room.removeFeed(feed)
    })
    feed.on('timeout', () => {
      resp.send(200)
      feed.stop()
    })
    setTimeout(() => feed.emit('timeout'), 30 * 1000)
    feed.start()
  })
