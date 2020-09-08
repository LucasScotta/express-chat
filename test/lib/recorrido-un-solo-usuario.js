const request = require('../server/request')
const util = require('../server/util')

describe("Should found the bug for me", () => {
  const agent = request.agent()
  const agent2 = request.agent()
  const post = () => {
    agent2
      .post('/msg')
      .send({ message: 'chau', roomId:1 })
    return 200
  }
  before((done) => {
    util.loggin(agent, done)
  })
  before((done) => {
    util.loggin2(agent2, done)
  })
  it('should response the chat', (done) => {
    agent
      .get('/chat')
      .expect(200, /<input id="send" name="message">/)
      .end(done)
  })

  it('should send a msg to the predefined room', (done) => {
    agent
      .post('/msg')
      .send({ message:'hola', roomId:1 })
      .expect(200, done())
  })
  it('s', (done) => {
    agent
      .post('/msg')
      .send({ message: 'chau', roomId:1 })
      .expect(200, done)
  })
  it('should response the chat to the 1st user with the new msg', (done) => {
    agent
      .get('/msg')
      .query({ roomId: 1 })
      .expect(post(done), /hola/)
  })
})
