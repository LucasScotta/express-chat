const request = require('../server/request')

describe("when path is '/api/logout'", () => {
  describe("when logged", () => {
    const agent = request.agent()
    before((done) => {
      agent
        .post('/api/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user=lucas')
        .send('pass=pass')
        .expect(302, /Redirecting to \//)
        .end(done)
    })
    it('should response a 200', (done) => {
      agent
        .get('/api/logout')
        .expect(200, 'Unlogged correctly')
        .end(done)
    })
  })
})
