let color
const waiting = []
const express = require('express')

module.exports = exports = express.Router()

exports.post('/', (req, resp) => {

  if (!req.body.color) return resp.sendStatus(400)
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

exports.get('/', (req, resp) => {

  if (req.query.color === 'undefined') {
    delete req.query.color
  }

  if (req.query.color !== color) {
    return resp.send({ color })
  }

  waiting.push(resp)
})
