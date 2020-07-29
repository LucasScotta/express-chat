const express = require('express')
const routes = require('./routes/routes')
const isLoged = require('./is-logged')

module.exports = () => {
	const router = express.Router()
	router.use(['/login', '/authenticate'], routes.login)
	router.use('/logout', isLoged, routes.logOut)
	router.use('/llame', isLoged, routes.llame)
	router.use('/llamaste', isLoged, routes.llamaste)
	router.use('/user', isLoged, routes.user)
	return router
}