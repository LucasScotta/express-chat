const app = require('../../app')
const request = require('supertest')

app.use('/ping', (req, resp) => {
  resp.send('pong')
})

app.use('/$', (req, resp) => {
  resp.send('Bienvenido')
})

describe('server.js', () => {

  describe("when path is '/ping'", () => {
    it("should send 'pong'", (done) => {
      request(app)
        .get('/ping')
        .expect('pong')
        .expect(200)
        .end(done)
    })
  })

  describe("when path is '/'", () => {
    it("should send 'Bienvenido'", (done) => {
      request(app)
        .get('/')
        .expect('Bienvenido')
        .expect(200)
        .end(done)
    })
  })

  describe("when path is unknown", () => {
    it("should response a 404", (done) => {
      request(app)
        .get('/a')
        .expect(404)
        .end(done)
    })
  })
})
