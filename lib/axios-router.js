const express = require('express')
const axiosRoutes = require('./axios-routes/routes')

module.exports = () => {
  const router = express.Router()
  router.use(/\/.+/, (req, resp) => {
    console.log(req._parsedOriginalUrl.pathname)
    resp.sendFile(process.env.HOME)
  })
  router.use('/ping', axiosRoutes.ping)
  router.post('/sumar', axiosRoutes.sumar)
  router.use('/smf', axiosRoutes.smf)
  router.get('/debug', axiosRoutes.debug)
  router.use('/msg', axiosRoutes.msg)
  router.get('/user', axiosRoutes.user)

  return router
}
