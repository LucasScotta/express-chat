const Chat = require('../../../lib/routes/chat')()
const Room = require('../../../lib/routes/chat/room')

describe('lib/routes/chat.js', () => {
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
      .to.be.false
  })

  it('should send a msg to the specified room', () => {
    const chat = new Chat()
    const room = chat.createRoom({name: 'lucas'})
    const feed = room.addUser({name:'lucas'})
    const roomId = room.getId()
    let msgRecieved
    feed.on('message', (message) => {
      console.log('assssssssssssss')
      msgRecieved = message
    })
    feed.start()
    const message = { message: 'hola', roomId}
    chat.sendMessage(message, roomId)
    expect(message)
      .to.be.equal(msgRecieved)
  })
  it('should throw on invalid msg', () => {
    const chat = new Chat()
    const room = chat.createRoom('')
    const roomId = room.getId()
    const result = () => chat.sendMessage({ message: null, roomId })
    expect(result)
      .to.throw(/Invalid message, expected string but got undefined/)
  })
  it('should throw on invalid Id', () => {
    const chat = new Chat()
    const result = () => chat.sendMessage({message: 'hola', roomId: 'a'})
    expect(result)
      .to.throw(/Invalid room ID/)
  })
  it('should throw on invalid Room Id', () => {
    const chat = new Chat()
    const room = chat.createRoom('')
    const roomId = room.getId()
    const result = () => chat.sendMessage({message: 'hola', roomdId: roomId + 1})
    expect(result)
      .to.throw(/Invalid room ID/)
  })
})
