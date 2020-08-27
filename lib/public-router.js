const express = require('express')
const publicRoutes = require('./public-routes/routes')

module.exports = () => {
  const router = express.Router()
  router.use(/\/.+/, (req, resp) => {
    console.log(req._parsedOriginalUrl.pathname)
    resp.sendFile(process.env.HOME)
  })
  router.use('/ping', publicRoutes.ping)
  router.post('/sumar', publicRoutes.sumar)
  router.use('/smf', publicRoutes.smf)
  router.get('/debug', publicRoutes.debug)
  router.use('/msg', publicRoutes.msg)
  router.get('/user', publicRoutes.user)

  return router
}
