const express = require('express')
const cookieParser = require('cookie-parser')
const sessions = require('./lib/sessions')
const bodyParser = require('body-parser')
const router = require('./lib/router')
const publicRouter = require('./lib/public-router')
process.env.HOME = __dirname + '/public/home.html'
module.exports = exports = express()

exports.use(cookieParser())
exports.use(sessions)
exports.use(bodyParser.urlencoded())
exports.use('/api', router())
exports.use(express.json())

exports.use('/$', (req, resp) => {
  resp.sendFile(__dirname + '/public/home.html')
})

exports.use('/ping', (req, resp) => {
  resp.send('pong')
})

exports.use(express.static('public'))


exports.post('/sumar', (req, resp) => {
  if (typeof req.body.number === 'number') {
    return resp.send(200, {number: req.body.number + 1})
  }
  return resp.sendStatus(417)
})
// 1. Administrar varios navegadores concurrentes
// 2. Notificar de cambio de colores solamente (Si es el mismo color, seguir esperando)

let color
const waiting = []

exports.post('/smf', (req, resp) => {

  if (color === req.body.color) return resp.sendStatus(200)

  color = req.body.color
  resp.sendStatus(200)
  //mandarle el color a cada cliente, y sacarlo de la lista
  //mientras tenga elemntos en waiting hacer:
  //1. sacar un elemento del array
  //2. procesar ese elemento
  while(waiting.length > 0) {
    const client = waiting.pop()
    client.send({ color })
  }
})

exports.get('/err', (req, resp) => {
  console.error('error de prueba')
  resp.send(200)
})
exports.get('/smf', (req, resp) => {

  if (req.query.color === 'undefined') {
    delete req.query.color
  }

  if (req.query.color !== color) {
    resp.send({ color })
  }
  else {
    waiting.push(resp)
  }
})

exports.get('/debug', (req, resp) => {
  console.log('feed', feed)
  resp.sendStatus(200)
})

exports.post('/msg', (req, resp) => {
  if (!req.sesion.user.name) {
    return resp.sendStatus(417)
  }

  if (typeof req.body.connection === 'number') {
    return feed.emit('connection-0', {req, resp})
  }

  const msg = req.body.msg

  // const feed = chat.createPublisher('/room/12')
  // feed.publish(msg)
  // resp.send(200)

  if (msg === "") resp.sendStatus(200)
  else {
    chat.sendMsg({
      msg,
      name: req.sesion.user.name,
      date: Date.now(),
      sent:0,
      clients: feed.clients,
    })
    feed.emit('message', {
      msg,
      name: req.sesion.user.name,
      date: Date.now(),
      sent:0,
      clients: feed.clients,
    })
    resp.sendStatus(200)
  }
})

exports.get('/msg', (req, resp) => {

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

exports.get('/user', (req, resp) => {
  if (req.sesion.user) {
    resp.send({ user: req.sesion.user.name })
  }
  else resp.sendStatus(200)
})
