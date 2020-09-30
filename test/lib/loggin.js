const request = require('../server/request')
const util = require('../server/util')

describe("when path is loggin", () => {

  describe("when logged", () => {
    const agent = request.agent()
    before((done) => {
      util.loggin(agent, done)
    })
    it('should response a 200 and home page', (done) => {
      agent
        .get('/loggin')
        .expect(200, /Bienvenido/)
        .expect(200, /LUCAS/)
        .end(done)
    })
  })

  describe("when not logged", () => {
    it("should response a 200 and loggin page", (done) => {
      request()
        .get('/loggin')
        .expect(200, /form/, /button/, /user/, /pass/)
        .expect('Content-Type', /text\/html/)
        .end((err, body) => {
          if (err) return done(err)
          expect(body).to.be.not.a('string')
          expect(body).to.be.an('object')
          done()
        })
    })
  })

  describe("when user or pass are wrong", () => {
    describe("when user is wrong", () => {
      it("should response the loggin page", (done) => {
        request()
          .post('/loggin')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send('user=wrong user')
          .send('pass=pass')
          .expect(200, /action.+loggin/)
          .end(done)
      })
    })

    describe("when pass is wrong", () => {
      it("should response the loggin page", (done) => {
        request()
          .post('/loggin')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send('user=lucas')
          .send('pass=wrong password')
          .expect(200, /action.+loggin/)
          .end(done)
      })
    })
  })

  describe("when there is not user or pass", () => {
    describe("when there is not user", () => {
      it("should response a 417", (done) => {
        request()
          .post('/loggin')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send('user=lucas')
          .expect('Content-Type', /text/)
          .expect(417)
          .end(done)
      })
    })

    describe("when there is not pass", () => {
      it("should response a 417", (done) => {
        request()
          .post('/loggin')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send('pass=lucas')
          .expect('Content-Type', /text/)
          .expect(417)
          .end(done)
      })
    })
  })
})
