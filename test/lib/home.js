const request = require('../server/request')
const util = require('../server/util')

describe("When path is '/'", () => {
  describe("When logged", () => {
    const agent = request.agent()
    before((done) => {
      util.loggin(agent, done)
    })
    it('should response the logged home page', (done) => {
      agent
        .get('/')
        .expect(200, /Bienvenido/, /lucas/, /Disconnect/)
        .end(done)
    })
  })
  describe("When not logged", () => {
    it('should response the disconnected home page', (done) => {
      request()
        .get('/')
        .expect(200, /Bienvenido/, /Loggin/)
        .end(done)
    })
  })
})
