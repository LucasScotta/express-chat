// Local, request, sesion, usuario, global
const express = require('express')
const config = require('../config')
const users = require('../users')(config.user)

module.exports = exports = express.Router()

exports.get('/', (req, resp) => {
  const user = req.sesion.user
  if (user) {
    return resp.redirect('/')
  }
  resp.render('./loggin/create/form')
})

exports.post('/', (req, resp) => {
  const user = req.body.user
  const pass = req.body.pass
  if(user && pass) {
    users.add(user, pass, (err) => {
      if(err) return resp.sendStatus(417)
      else resp.render('./loggin/index', {user: null, err: err ? err : null}, (err, html) => {
        if (err) {
          console.log(err)
          resp.sendStatus(500)
          throw err
        }
        return resp.send(html)
      })
    })
  }
  else return resp.sendStatus(417)
})
