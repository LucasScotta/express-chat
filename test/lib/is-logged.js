const request = require('supertest')
const express = require('express')
const app = express()

const isLoged = require('../../lib/is-logged')

describe('lib/is-logged', () => {
  describe('when date is less than 3 min', () => {
    it('should response a json document with a count', (done) => {
      const req = {
        sesion: {
          time: Date.now(),
          user: 'lucas',
        }
      }
      const resp = {}
      request(app)
        .get(isLoged(req, resp, done))
        .expect('Content-Type', 'application/json')
        .end(done)
    })
  })

  describe('when date is more than 3 min', () => {
    it('should delete req.sesion.user', (done) => {
      const req = {
        sesion: {
          time: Date.now() - 60 * 3 * 1000,
          user: 'lucas',
        }
      }
      const resp = {
        sendFile: (file) => file
      }
      request(app)
        .get(isLoged(req, resp, done))
        .expect('Content-Type', 'text/html; charset=utf-8')
        .end(done)
    })
  })
})
