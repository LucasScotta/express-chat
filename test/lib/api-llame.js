const request = require('../server/request')

describe("when path is '/api/llame'", () => {
  describe("when logged", () => {
    const agent = request.agent()
    before((done) => {
      agent
        .post('/api/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user=lucas')
        .send('pass=pass')
        .expect(200)
        .expect('Content-Type', /text/)
        .end(done)
    })
    it('should response a json document with count', (done) => {
      agent
        .get('/api/llame')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done)
    })
  })
  describe("when logged off", () => {
    it('should response a 301 with login page', (done) => {
      request()
        .get('/api/llame')
        .expect(301, /form/)
        .expect('Content-Type', /text\/html/)
        .end(done)
    })
  })
})
