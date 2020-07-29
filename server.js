// Si tu codigo hace require debe estar declarado como dependencia en el package.json
const PORT = 8080
const express = require('express')
const app = express()
// const path = require('path')
const router = require('./lib/router')
const cookieParser = require('cookie-parser')
const sessions = require('./lib/sessions')
const bodyParser = require('body-parser')

app.use(cookieParser())
app.use(sessions)
app.use(bodyParser.urlencoded())

app.use('/api', router())

app.use('/ping', (req, resp) => {
	resp.send('pong')
})

app.use(express.static('public'))

app.use('/$', (req, resp) => {
	resp.send('hola')
})

app.listen(PORT)
console.log('listen on localhost:8080')