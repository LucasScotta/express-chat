const request = require('../server/request')

describe("when path is '/api/user'", () => {
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
    it('should response a json document with count', (done) => {
      agent
        .get('/api/user')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done)
    })
  })
  describe("when not logged", () => {
    it("should response a 301 and login page", (done) => {
      request()
        .get('/api/user')
        .expect(301, /form/)
        .expect('Content-Type', /text/)
        .end(done)
    })
  })
})
