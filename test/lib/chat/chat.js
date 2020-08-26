const Chat = require('../../../lib/chat/chat')
const Room = require('../../../lib/chat/room')

describe('lib/chat/chat.js', () => {
  it('should create a room', () => {
    const chat = new Chat()
    const room = chat.createRoom()
    expect(room).to.be.instanceof(Room)
  })
}
