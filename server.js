// Si tu codigo hace require debe estar declarado como dependencia en el package.json
const PORT = 8080
// const path = require('path')
const express = require('express')
const router = require('./lib/router')

const app = require('./app')

app.use('/api', router())

app.use('/ping', (req, resp) => {
  resp.send('pong')
})

app.use(express.static('public'))

app.use('/$', (req, resp) => {
  resp.send('Bienvenido')
})

app.listen(PORT)
console.log('listen on localhost:8080')
