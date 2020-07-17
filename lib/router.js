const login = require('./routes/login')
const express = require('express')

module.exports = () => {
	const router = express.Router()
	const l = login()
	router.use('/login', l)
	router.use('/authenticate', l)
	return router
}