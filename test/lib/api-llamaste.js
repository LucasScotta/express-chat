const request = require('../server/request')

describe("when path is '/api/llamaste'", () => {
  describe("when logged", () => {
    const agent = request.agent()
    before('log', (done) => {
      agent
        .post('/api/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user=lucas')
        .send('pass=pass')
        .expect(200)
        .end(done)
    })
    it('should response a json document with count', (done) => {
      agent
        .get('/api/llamaste')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done)
    })
  })

  describe("when logged off", () => {
    it('should response a 301 and login page', (done) => {
      request()
        .get('/api/llamaste')
        .expect(301, /form/)
        .expect('Content-Type', /text/)
        .end(done)
    })
  })
})
