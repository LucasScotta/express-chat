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
