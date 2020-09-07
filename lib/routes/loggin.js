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

exports.all('/', (req, resp) => {
  const user = req.sesion.user ? req.sesion.user.name : null
  if(!req.sesion.user) {
    resp.render('./loggin/index', { user }, (err, html) => {
      if (err) {
        resp.sendStatus(500)
        throw err
      }
      return resp.send(html)
    })
  }
  else {
    resp.render('./home/index', { user }, (err, html) => {
      if (err) {
        resp.sendStatus(500)
        throw err
      }
      return resp.send(html)
    })
  }
})

