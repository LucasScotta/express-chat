// Local, request, sesion, usuario, global
const express = require('express')
const config = require('../config')
const users = require('../users')(config.user)
const redir = require('./redir')
module.exports = exports = express.Router()

exports.post('/', (req, resp, next) => {
  const user = req.body.user
  const pass = req.body.pass

  if(!user || !pass) {
    return next()
  }
  users.getByPass(user, pass, (err, user) => {
    if(err) {
      return next()
    }
    else {
      req.sesion.user = user
      req.sesion.time = Date.now()
      resp.status(200)
      redir(req, resp, (err, path) => {
        if (err !== null) return resp.send('Bienvenido')
        else {
          resp.clearCookie('path')
          resp.redirect(path)
        }
      })
    }
  })
})

exports.all('/', (req, resp) => {
  if(!req.sesion.user) {
    resp.sendFile(__dirname + '/login.html')
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
