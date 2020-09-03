const Message = require('../../../lib/axios-routes/chat/message')

describe('lib/chat/message', () => {

  it('should create messages', () => {
    const message = new Message()
    const msge = {message: '1', roomId: 2}
    const msg = message.create(msge)
    expect(message)
      .to.be.instanceof(Message)
    expect(msg)
      .to.be.equal(msge)
  })
  it('should throw on invalid message', () => {
    const message = new Message()
    const msg1 = () => message.create({message: true, roomId:2})
    const msg2 = () => message.create({roomId:2})
    expect(msg1)
      .to.throw(/Invalid message, expected string/, /but got boolean/)
    expect(msg2)
      .to.throw(/Invalid message, expected string/, /but got null/)
  })
  it('should throw on invalid room id', () => {
    const message = new Message()
    const msg1 = () => message.create({message: 'asd', roomId: true})
    const msg2 = () => message.create({message: 'asd'})
    expect(msg1)
      .to.throw(/Invalid room id, expected number but got boolean/)
    expect(msg2)
      .to.throw(/invalid data: missing room id/)
  })

  it('should return the message', () => {
    const msge = 'asd'
    const message = new Message()
    message.create({message: msge, roomId: 1})
    const msg = message.getMessage()
    expect(msg)
      .to.be.equal(msge)
      .to.be.a('string')
  })
})
