const express = require('express')
const cookieParser = require('cookie-parser')
const sessions = require('./lib/sessions')
const bodyParser = require('body-parser')
const router = require('./lib/router')
process.env.API_ROUTE = '/api'

module.exports = exports = express()

exports.use(cookieParser())
exports.use(sessions)
exports.use(bodyParser.urlencoded())
exports.use('/api', router())
exports.use(express.json())

exports.use('/ping', (req, resp) => {
  resp.send('pong')
})

exports.use(express.static('public'))

exports.use('/$', (req, resp) => {
  resp.send('Bienvenido')
})

exports.post('/sumar', (req, resp) => {
  console.log(req.body.number)
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
