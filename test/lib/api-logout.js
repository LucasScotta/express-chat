const request = require('../server/request')
const util = require('../server/util')

describe("when path is '/logout'", () => {
  describe("when logged", () => {
    const agent = request.agent()
    before((done) => {
      util.loggin(agent, done)
    })
    it('should response a 200', (done) => {
      agent
        .get('/logout')
        .expect(200, 'Unlogged correctly')
        .end(done)
    })
  })
})
