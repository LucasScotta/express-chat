const express = require('express')
const axiosRoutes = require('./axios-routes/routes')
module.exports = () => {
  const router = express.Router()
  router.use('/ping', axiosRoutes.ping)
  router.post('/sumar', axiosRoutes.sumar)
  router.use('/smf', axiosRoutes.smf)
  router.get('/debug', axiosRoutes.debug)
  router.use('/msg', axiosRoutes.msg)
  router.get('/user', axiosRoutes.user)
  router.get('/loggin', axiosRoutes.loggin)
  router.use(/\/.*/, axiosRoutes.home)

  return router
}
