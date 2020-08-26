const Room = require('../../../lib/chat/room')
const Feed = require('../../../lib/chat/feed')

describe('/lib/chat/room', () => {
  it('should auto-assign room ids', () => {
    const room1 = new Room()
    const room2 = new Room()
    const id1 = room1.getId()
    const id2 = room2.getId()
    expect(id1)
      .to.be.a('number')
      .to.be.below(id2)
  })
}
