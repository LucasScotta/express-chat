const request = require('../server/request')
const unlink = require('./unlink')
const config = require('../config')

describe("when path is '/api/login/create'", () => {
  describe("when there's no user or pass", () => {
    describe("when there's no user", () => {
      it("should response a 417", (done) => {
        request()
          .get('/api/login/create')
          .query({ user: 'asdsa'})
          .expect(417)
          .end(done)
      })
    })
    describe("when there's no pass", () => {
      it("should response a 417", (done) => {
        request()
          .get('/api/login/create')
          .query({ pass: 'asdaa'})
          .expect(417)
          .end(done)
      })
    })
  })

  describe("when user exists", () => {
    it("should response a 417", (done) => {
      request()
        .get('/api/login/create')
        .query({ user: 'lucas'})
        .query({ pass: 'soyio'})
        .expect(417)
        .end(done)
    })
  })

  describe("when user doesn't exists", () => {
    it("should create a new user", (done) => {
      request()
        .get('/api/login/create')
        .query({ user: 'user'})
        .query({ pass: 'pass'})
        .expect(200)
        .end(done)
    })
    after((done) => {
      console.log(config.path)
      unlink(config.path + '/user.json', done)
    })
  })
})
