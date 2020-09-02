const Room = require('../../../lib/axios-routes/chat/room')

describe('intgr/chat/room', () => {

  it('should send messages to some users', () => {
    const room = new Room({name: 'lucas'})

    const spy = chai.spy()

    const payload1 = {1: 1, 2: 2, 3: 3}
    const payload2 = {a:'a',b:'b',c:'c'}
    const payload3 = {a:1,b:2,c:3}

    const feed1 = room.addUser('lucas')
    const feed2 = room.addUser('martin')

    feed1.on('msg', spy)
    feed2.on('msg', spy)

    feed1.emit('msg', payload1)
    feed2.emit('msg', payload1)
    feed1.emit('msg', payload2)
    feed2.emit('msg', payload2)
    feed1.emit('msg', payload3)
    feed2.emit('msg', payload3)
    expect(spy)
      .to.be.called(6)
      .on.nth(1).with(payload1)
      .on.nth(2).with(payload1)
      .on.nth(3).with(payload2)
      .on.nth(4).with(payload2)
      .on.nth(5).with(payload3)
      .on.nth(6).with(payload3)
  })
})
