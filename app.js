const app = require('express')()
const cookieParser = require('cookie-parser')
const sessions = require('./lib/sessions')
const bodyParser = require('body-parser')

app.use(cookieParser())
app.use(sessions)
app.use(bodyParser.urlencoded())

module.exports = app
