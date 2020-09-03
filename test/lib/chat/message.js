const Message = require('../../../lib/axios-routes/chat/message')

describe('lib/chat/message', () => {

  it('should create messages', () => {
    const message = new Message()
    const msge = {message: '1', roomId: 2, user: 'lucas', date: Date.now()}
    const msg = message.create(msge)
    expect(message)
      .to.be.instanceof(Message)
    expect(msg)
      .to.be.equal(msge)
  })
  it('should throw on invalid message', () => {
    const message = new Message()
    const msg1 = () => message.create({message: true, roomId:2, user: 'lucas', date: Date.now()})
    const msg2 = () => message.create({roomId:2, user: 'lucas', date: Date.now()})
    expect(msg1)
      .to.throw(/Invalid message, expected string.*but got boolean/)
    expect(msg2)
      .to.throw(/Invalid data: Missing message/)
  })
  it('should throw on invalid room id', () => {
    const message = new Message()
    const msg1 = () => message.create({message: 'asd', roomId: 'a', user: 'lucas', date: Date.now()})
    // const msg2 = () => message.create({message: 'asd', user: 'lucas', date: Date.now()})
    expect(msg1)
      .to.throw(/Invalid room id, expected number but got NaN/)
    // expect(msg2)
      // .to.throw(/Invalid data: Missing room id/)
  })
  it('should throw on invalid user', () => {
    const message = new Message()
    const msg1 = () => message.create({message: 'asd', roomId: 1, date: Date.now()})
    const msg2 = () => message.create({message: 'asd', roomId: 1, user: 1, date: Date.now()})
    expect(msg1)
      .to.throw(/Invalid data: Missing user/)
    expect(msg2)
      .to.throw(/Invalid user, expected string but got number/)
  })
  it('should throw on invalid Date', () => {
    const message = new Message()
    const msg1 = () => message.create({message: 'asd', roomId: 1, user: 'a'})
    const msg2 = () => message.create({message: 'asd', roomId: 1, user: 'a', date: 'a'})
    const msg3 = () => message.create({message: 'asd', roomId: 1, user: 'a', date: Date.now() + 190000 * 1000})
    expect(msg1)
      .to.throw(/Invalid data: Missing Date/)
    expect(msg2)
      .to.throw(/Invalid date, expected number but got string/)
    expect(msg3)
      .to.throw(/Invalid date, message sent from the future/)
  })

  it("should return the user who sent the message", () => {
    const message = new Message()
    const user = 'lucas'
    message.create({message: 'a', roomId: 1, user, date: Date.now()})
    const usr = message.getUser()
    expect(usr)
      .to.be.equal(user)
  })

  it("should return the message's data", () => {
    const message = new Message()
    const data = {message: 'a', roomId: 1, user: 'lucas', date: Date.now()}
    const msg = message.create(data)
    expect(msg)
      .to.be.equal(data)
  })

  it('should return the message', () => {
    const msge = 'asd'
    const message = new Message()
    message.create({message: msge, roomId: 1, user: 'lucas', date: Date.now()})
    const msg = message.getMessage()
    expect(msg)
      .to.be.equal(msge)
      .to.be.a('string')
  })

  it("should return the message's Date", () => {
    const message = new Message()
    const date = Date.now()
    message.create({message: 'a', roomId: 1, user: 'lucas', date})
    const msgDate = message.getDate()
    expect(msgDate)
      .to.be.a('number')
      .to.be.equal(date)
  })

  it("should return the message's room id", () => {
    const roomId = 1
    const message = new Message()
    message.create({message: 'asd', roomId, user: 'lucas', date: Date.now()})
    const id = message.getId()
    expect(id)
      .to.be.equal(roomId)
      .to.be.a('number')
  })
})
