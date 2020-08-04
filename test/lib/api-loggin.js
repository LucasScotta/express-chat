const request = require('../server/request')

describe("when path is loggin", () => {

  describe("when logged", () => {
    const agent = request.agent()
    before((done) => {
      agent
        .post('/api/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user=lucas')
        .send('pass=pass')
        .expect(200, done)
    })
    it('should response a 417 and text', (done) => {
      agent
        .get('/api/login')
        .expect(417, 'Ya estas logeado, so tonto?')
        .end(done)
    })
  })

  describe("when not logged", () => {
    it("should response a 200 and loggin page", (done) => {
      request()
        .get('/api/login')
        .expect(200, /form/)
        .expect(/button/)
        .expect(/user/)
        .expect(/pass/)
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
      it("should respnse a 417 and loggin page", (done) => {
        request()
          .post('/api/login')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send('user=wrong user')
          .send('pass=pass')
          .expect('Content-Type', /text\/html/)
          .expect(417, /form/)
          .end(done)
      })
    })

    describe("when pass is wrong", () => {
      it("should response a 417 and loggin page", (done) => {
        request()
          .post('/api/login')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send('user=lucas')
          .send('pass=password')
          .expect('Content-Type', /text\/html/)
          .expect(417, /form/)
          .end(done)
      })
    })
  })

  describe("when there is not user or pass", () => {
    describe("when there is not user", () => {
      it("should response a 417, and loggin page", (done) => {
        request()
          .post('/api/login')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send('user=lucas')
          .expect('Content-Type', /text/)
          .expect(417)
          .end(done)
      })
    })

    describe("when there is not pass", () => {
      it("should response a 417, and loggin page", (done) => {
        request()
          .post('/api/login')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send('pass=lucas')
          .expect('Content-Type', /text/)
          .expect(417)
          .end(done)
      })
    })
  })
})
