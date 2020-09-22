const express = require('express')
const Chat = require('./chat')()
const chat = new Chat()
const timeout = {timeoutInMillis: 30000}
chat.createRoom(timeout)
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

exports.get('/debug', (req, resp) => {
  console.log(chat.getRooms())
  console.log('--------------------------------------------------')
  resp.sendStatus(200)
})

exports.get('/message', (req, resp) => {

  const user = req.sesion.user
  const userBlock = req.query.userBlock
  const userUnblock = req.query.userUnblock
  if (userBlock && userBlock === user.name) return resp.sendStatus(417)
  if (userUnblock && userUnblock === user.name) return resp.sendStatus(417)
  if (userBlock && userBlock !== user.name) {
    user.block.push(userBlock)
    return resp.sendStatus(200)
  }
  if (userUnblock && userUnblock !== user.name) {
    const remove = []
    user.block.forEach((user, index) => {
      if (user === userUnblock) {
        remove.push(index)
      }
    })
    if (remove.length > 0) {
      user.block.splice(remove.pop(), 1)
      return resp.sendStatus(200)
    }
  }
  const id = req.query.roomId
  const room = chat.getRoom(id)
  if (!room) {
    return resp.sendStatus(400)
  }
  const feed = room.addUser(user)

  feed.on('message', (message) => {
    const found = user.block.some(blocked => blocked === message.user)
    if (found) {
      resp.send(200)
    }
    else {
      resp.send(message)
    }
    feed.stop()
  })

  feed.on('timeout', () => {
    resp.send(200)
    feed.stop(true)
  })

  feed.start()
})

exports.get('/create', (req, resp) => {
  resp.render('./chat/create/index', (err, html) => {
    if (err) {
      resp.sendStatus(500)
      throw err
    }
    return resp.send(html)
  })
})

exports.post('/create', (req, resp) => {
  const invite = req.body.user
  const description = req.body.desciption
  console.log(invite, description)
  chat.createRoom(timeout)
  resp.redirect('/')
})


exports.use('/', (req, resp) => {
  const user = req.sesion.user
  const view = user
    ? './chat/index'
    : './loggin/index'
  const userName = user
    ? user.name
    : null

  const ids = []
  chat.getRooms().forEach(room => {
    room.suscriptors.forEach(suscriptor => {
      if (suscriptor === user.name) {
        ids.push(room.getId())
      }
    })
  })

  resp.render(view, { user: userName }, (err, html) => {
    if (err) {
      resp.sendStatus(500)
      throw err
    }
    return resp.send(html)
  })
})
