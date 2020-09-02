const request = require('../server/request')

describe("When path is '/'", () => {
  describe("When logged", () => {
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
    it('should response the logged home page', (done) => {
      agent
        .get('/')
        .expect(200, /Welcome/, /lucas/, /Disconnect/)
        .end(done)
    })
  })
  describe("When not logged", () => {
    it('should response the disconnected home page', (done) => {
      request()
        .get('/')
        .expect(200, /Welcome/, /Loggin/)
        .end(done)
    })
  })
})
