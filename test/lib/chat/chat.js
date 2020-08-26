const Chat = require('../../../lib/chat/chat')
const Room = require('../../../lib/chat/room')

describe('lib/chat/chat.js', () => {
  it('should create a room', () => {
    const chat = new Chat()
    const room = chat.createRoom()
    expect(room).to.be.instanceof(Room)
  })

  it('should return an existing room', () => {
    const chat = new Chat()
    const room = chat.createRoom()
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
    const r1 = chat.createRoom()
    const r2 = chat.createRoom()
    const r3 = chat.createRoom()
    const rooms = chat.getRooms()
    expect(rooms)
      .to.be.an('array')
      .to.have.length(3)
      .to.have.members([r1, r2, r3])
  })
}
