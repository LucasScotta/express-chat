const express = require('express')
module.exports = () => {
	const router = express.Router()
	router.use('/', (req, resp) => {
		resp.sendFile(__dirname + '/login.html')
	})
	return router
}