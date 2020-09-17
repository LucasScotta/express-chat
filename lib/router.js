const express = require('express')
const routes = require('./routes/routes')
const isLogged = require('./is-logged')

module.exports = () => {
  const router = express.Router()

  router.use(['/loggin', '/authenticate'], routes.loggin)
  router.use('/logout', isLogged, routes.logOut)
  router.use('/create', routes.create)

  router.use('/chat', isLogged, routes.chat)

  router.use('/ping', routes.ping)
  router.get('/debug', routes.debug)
  router.post('/sumar', routes.sumar)
  router.use('/smf', routes.smf)
  router.use(/\/.*/, routes.home)
  return router
}
