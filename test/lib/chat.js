const request = require('../server/request')
const util = require('../server/util')
describe("/chat", () => {

  describe("When not logged", () => {
    it('Should response the home-page', done => {
      request()
        .get('/chat')
        .expect(200, /form.*loggin/)
        .end(done)
    })
  })

  describe("When logged", () => {
    const agent = request.agent()
    before('log', done => {
      util.loggin(agent, done)
    })
    it("Should response the chat-page", done => {
      agent
        .get('/chat')
        .expect(200, /id="chat"/)
        .expect(200, /Send/)
        .expect(200, /messages/)
        .end(done)
    })
  })
})
