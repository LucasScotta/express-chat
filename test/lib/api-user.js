const request = require('../server/request')
const util = require('../server/util')

describe("when path is '/user'", () => {
  describe("when logged", () => {
    const agent = request.agent()
    before((done) => {
      util.loggin(agent, done)
    })
    it('should response a json document with count', (done) => {
      agent
        .get('/user')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done)
    })
  })
  describe("when not logged", () => {
    it("should response a 302 and login page", (done) => {
      request()
        .get('/user')
        .expect(200, /form.*loggin/)
        .expect('Content-Type', /text/)
        .end(done)
    })
  })
})
