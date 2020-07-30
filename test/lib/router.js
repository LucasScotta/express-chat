const app = require('../../app')
const request = require('supertest')
const router = require('../../lib/router')
const fs = require('fs')
const config = {
  path: __dirname + '../../datos/users',
}

app.use('/api', router())

describe('/api', ()=> {
  const unlink = (path, next) => {
    fs.unlink(path, (err) => {
      if(err && err.code !== 'ENOENT') next(err)
      else next()
    })
  }

  describe("when path is '/api'", () => {
    it("should response a 404", (done) => {
      request(app)
        .get('/api')
        .expect(404)
        .end(done)
    })
  })


  describe("when path is '/api/user'", () => {
  describe("when logged", () => {
    it('should response a json document with count', (done) => {
      request(app)
      .auth('lucas', 'soyio')
      .get('/api/user')
      .end(done)
    })
  })
  })


  describe("when path is '/api/llamaste'", () => {
  // describe("when logged", () => {
  //   it('should response a json document with count', (done) => {
  //     request(app)
  //     .get('/api/llamaste')
  //     .expect('Content-Type', 'application/json')
  //     .end(done)
  //   })
  // })
  })


  describe("when path is '/api/llame'", () => {
    // it('should response a json document with count', (done) => {
    //   request(app)
    //   .get('/api/llame')
    //   .expect('Content-Type', 'application/json')
    //   .end(done)
    // })
  })


  describe("when path is '/api/login/create'", () => {
    describe("when user exists", () => {
      it("should response a 417", (done) => {
        request(app)
          .get('/api/login/create')
          .query({ user: 'lucas'})
          .query({ pass: 'soyio'})
          .expect(417)
          .end(done)
      })
    })
    describe("when user doesn't exists", () => {
      it("should create a new user", (done) => {
        request(app)
          .get('/api/login/create')
          .query({ user: 'user'})
          .query({ pass: 'pass'})
          .expect(200)
          .end(done)
      })
      //FALTA BORRAR EL ARCHIVO (after?)
      unlink(config.path + '/user.json', (err) => {

      })
  })
  describe("when path is '/api/logout'", () => {
    it('should response a 200', (done) => {
      request(app)
        .get('/api/logout')
        .expect(200)
        .end(done)
    })
  })
})
