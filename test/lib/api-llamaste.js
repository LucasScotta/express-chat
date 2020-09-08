const request = require('../server/request')
const util = require('../server/util')

xdescribe("when path is 'llamaste'", () => {
  describe("when logged", () => {
    const agent = request.agent()
    before('log', (done) => {
      util.loggin(agent, done)
    })
    it('should response a json document with count', (done) => {
      agent
        .get('/llamaste')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done)
    })
  })

  describe("when logged off", () => {
    it('should response a 302 and login page', (done) => {
      request()
        .get('/llamaste')
        .expect(302, /Redirecting to \//)
        .expect('Content-Type', /text/)
        .end(done)
    })
  })
})
