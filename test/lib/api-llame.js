const request = require('../server/request')
const util = require('../server/util')

xdescribe("when path is '/api/llame'", () => {
  describe("when logged", () => {
    const agent = request.agent()
    before((done) => {
      util.loggin(agent, done)
    })
    it('should response a json document with count', (done) => {
      agent
        .get('/llame')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done)
    })
  })
  describe("when logged off", () => {
    it('should response a 302 with login page', (done) => {
      request()
        .get('/llame')
        .expect(302, /Redirecting to \/loggin/)
        .end(done)
    })
  })
})
