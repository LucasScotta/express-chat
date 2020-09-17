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
  const user = req.sesion.user
  const name = user
    ? user.name
    : null
  const path = user
    ? './home/index'
    : './loggin/index'
    resp.render(path, { user: name }, (err, html) => {
      if (err) {
        resp.sendStatus(500)
        throw err
      }
      return resp.send(html)
    })
})
