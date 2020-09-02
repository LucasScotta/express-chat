// Local, request, sesion, usuario, global
const express = require('express')
const config = require('../config')
const users = require('../users')(config.user)

module.exports = exports = express.Router()

exports.post('/', (req, resp, next) => {
  const userName = req.body.user
  const pass = req.body.pass

  if(!userName || !pass) {
    resp.status(417)
    return next()
  }
  users.getByPass(userName, pass, (err, user) => {
    if(err) {
      resp.status(417)
      return next()
    }
    else {
      req.sesion.user = user
      req.sesion.time = Date.now()
      req.sesion.user.name = userName

      resp.redirect('/')
    }
  })
})

exports.all('/', (req, resp) => {
  if(!req.sesion.user) {
    resp.redirect('/loggin')
  }
  else resp.status(417).send('Ya estas logeado, so tonto?')
})

exports.get('/create', (req, resp) => {
  const user = req.query.user
  const pass = req.query.pass
  if(user && pass) {
    users.add(user, pass, (err) => {
      if(err) return resp.sendStatus(417)
      else resp.sendStatus(200)
    })
  }
  else return resp.sendStatus(417)
})
