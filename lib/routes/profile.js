const express = require('express')
const config = require('../config')
const users = require('../users')(config.user)
module.exports = exports = express.Router()

exports.post('/', (req, resp) => {
  const user = req.sesion.user
  if (!user) {
    return resp.redirect('/loggin')
  }
  const search = req.body.user
  if (search) {
    return resp.redirect('/profile/' + search)
  }
  else {
    resp.render('./perfil/index.html', {user: user.name, err: null}, (err, html) => {
      if (err) {
        resp.send(500)
        throw err
      }
      return resp.send(html)
    })
  }
})

exports.get(/^\/.+/, (req, resp) => {
  const user = req.sesion.user
  const searchUser = req.url.replace(/\//, "")
  users.get(searchUser, (err, getUser) => {
    if (err) {
      resp.render('./perfil/index.html', {user: user.name, err}, (err, html) => {
        if (err) {
          console.log(err, 'en profile.js')
          throw err
        }
        return resp.send(html)
      })
    }
    else {
      console.log(getUser)
      resp.render('./perfil/get.html', {user: user.name, searchName: searchUser}, (err, html) => {
        if (err) {
          resp.send(500)
          throw err
        }
        return resp.send(html)
      })
    }
  })
})

exports.get('/', (req, resp) => {

  const user = req.sesion.user
  resp.render('./perfil/index.html', {user: user.name, err: null}, (err, html) => {
    if (err) {
      resp.send(500)
      throw err
    }
    resp.send(html)
  })
})
