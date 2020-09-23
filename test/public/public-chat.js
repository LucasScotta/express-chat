const request = require('../server/request')
const util = require('../server/util')
describe('When path is chat', () => {
  describe('When logged', () => {
    const agent = request.agent()
    before((done) => {
      util.loggin(agent, done)
    })
    it('should response 200 and chat', (done) => {
      agent
        .get('/chat')
        .expect(200, /chat/, /messages/, /send/, /message/)
        .end(done)
    })
  })

  describe('When not logged', () => {
    it('should response a 200 to the loggin form', (done) => {
      request()
        .get('/chat')
        .expect(200, /form/, /user/, /pass/)
        .end(done)
    })
  })
})
