const Room = require('../../../lib/axios-routes/chat/room')

describe('intgr/chat/room', () => {
  it('should send messages to some users', () => {
    const room = new Room({name: 'lucas'})

    const spy1 = chai.spy()
    const spy2 = chai.spy()

    const payload1 = {1: 1, 2: 2, 3: 3}
    const payload2 = {a:'a',b:'b',c:'c'}
    const payload3 = {a:1,b:2,c:3}

    const feed1 = room.addUser('lucas')
    const feed2 = room.addUser('martin')

    feed1.on('message', spy1)
    feed2.on('message', spy2)
    setTimeout(() => room.publishMessage(payload1), 5000)
    setTimeout(() => room.publishMessage(payload2), 10000)
    setTimeout(() => room.publishMessage(payload3), 15000)
    expect(spy1)
      .to.be.called(3)
      .on.nth(1).with(payload1)
      .on.nth(2).with(payload2)
      .on.nth(3).with(payload3)
    expect(spy2)
      .to.be.called(3)
      .on.nth(1).with(payload1)
      .on.nth(2).with(payload2)
      .on.nth(3).with(payload3)
  })
})



/*
1. Con 2 usuarios loggeados.
2. Con una diferencia de 15s.
3. Hacer el recorrido completo desde loggearse hasta recibir el mensaje haciendo expects detalladamente.
*/
