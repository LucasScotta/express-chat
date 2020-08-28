const Chat = require('../../../lib/axios-routes/chat')()
const Room = require('../../../lib/axios-routes/chat/room')

describe('lib/chat/chat.js', () => {
  it('should create a room', () => {
    const chat = new Chat()
    const room = chat.createRoom({name: 'lucas'})
    expect(room).to.be.instanceof(Room)
  })

  it('should return an existing room', () => {
    const chat = new Chat()
    const room = chat.createRoom({name: 'lucas'})
    const result = chat.getRoom(room.getId())
    expect(result)
      .to.be.equal(room)
  })
  it('should return a non existing room', () => {
    const chat = new Chat()
    const room = chat.getRoom(7)
    expect(room)
      .to.be.null
  })

  it('should return created rooms', () => {
    const chat = new Chat()
    const r1 = chat.createRoom({name: 'lucas'})
    const r2 = chat.createRoom({name: 'lucas'})
    const r3 = chat.createRoom({name: 'lucas'})
    const rooms = chat.getRooms()
    expect(rooms)
      .to.be.an('array')
      .to.have.length(3)
      .to.have.members([r1, r2, r3])
  })

  it('should delete a room, existing', () => {
    const chat = new Chat()
    const r1 = chat.createRoom({name: 'lucas'})
    const r2 = chat.createRoom({name: 'lucas'})
    const r3 = chat.createRoom({name: 'lucas'})
    const removed = chat.removeRoom(r2)
    expect(removed)
      .to.be.equal(true)
    const rooms = chat.getRooms()
    expect(rooms)
      .to.have.length(2)
      .to.have.members([r1, r3])
  })
  it('should delete a room, non existing', () => {
    const chat1 = new Chat()
    const chat2 = new Chat()
    const room = chat1.createRoom({name: 'lucas'})
    const removed = chat2.removeRoom(room)
    expect(removed)
      .to.be.equal(false)
  })

  it('should return messages', () => {
    const chat = new Chat()
    const room = chat.createRoom({name: 'lucas'})
    const msgs = room.getMessages()
    expect(msgs)
      .to.be.an('array')
      .to.have.length(0)
  })

  it('should send a msg to the specified room', () => {
    const chat = new Chat()
    const room = chat.createRoom({name: 'lucas'})
    const id = room.getId()
    const msg = {
    }
    const msg2 = {
    }
    chat.sendMessage(msg, id)
    chat.sendMessage(msg2, id)
    const msgs = room.getMessages()
    expect(msgs)
      .to.have.members([msg, msg2])
      .to.have.length(2)
  })
  it('should throw on invalid msg or id', () => {
    const chat = new Chat()
    const result = () => chat.sendMessage({}, 2)
    expect(result)
      .to.throw(Error)
  })
})
