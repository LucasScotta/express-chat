const express = require('express')
const cookieParser = require('cookie-parser')
const sessions = require('./lib/sessions')
const bodyParser = require('body-parser')
const chat = require('./lib/chat')()
const router = require('./lib/router')
const feed = require('./lib/chat/feed')
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

  if (client) {
    const index = clientsWaiting.indexOf(client)
    delete client.req.sesion.date
    delete client.req.sesion.connected
    clientsWaiting.splice(index, 1)
    clients -= 1
  }
  else if (clientsWaiting.length > 0) {
    clientsWaiting.forEach((client, index, arr) => {
      if (client.req.sesion.date + 10 * 1000 < Date.now()) {
        delete arr[index].req.sesion.date
        delete arr[index].req.sesion.connected
        arr.splice(index, 1)
        clients -= 1
      }
    })
  }
  setTimeout(() => clearClients(), 60 * 3 * 1000)
}

clearClients()

const isNewClient = (req) => {
  return typeof req.sesion.lastDate !== 'number'
}

exports.get('/msg', (req, resp) => {
  // Si el cliente es nuevo
  // Si el cliente recibio todos los mensajes
  // Si el cliente, ya esta en espera
  if (isNewClient(req)) {
    //seteo date, sumo un cliente y lo pongo en espera
    req.sesion.lastDate = Date.now()
    clients += 1
    // Aca deberia ir como 'name' el nombre de usuario (creo)
    req.sesion.connected = true
    // Aca deberia ir como 'name' el nombre de usuario (creo)
    clientsWaiting.push({ req, resp })
  }
  else {
    if (!req.sesion.connected) {
      req.sesion.lastDate = Date.now()
    // Aca deberia ir como 'name' el nombre de usuario (creo)
      req.sesion.connected = true
    // Aca deberia ir como 'name' el nombre de usuario (creo)
      clientsWaiting.push({ req, resp })
   }
   else {
    resp.send(417)
   }
  }
})
