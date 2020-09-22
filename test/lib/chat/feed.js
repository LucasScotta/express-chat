const Feed = require('../../../lib/routes/chat/feed')

describe('/lib/routes/chat/feed', () => {
  it('should return its user', () => {
    const user = 'lucas'
    const feed = new Feed({userName: user})
    const result = feed.getUser()
    expect(result)
      .to.be.equal(user)
  })

  it('should belong to user', () => {
    const user = 'lucas'
    const feed = new Feed({userName: user})
    const belongs = feed.belongsTo(user)
    expect(belongs)
      .to.be.true
  })

  it('should not belong to user', () => {
    const name = 'lucas'
    const feed = new Feed({}, {name: 'martin'})
    const belongs = feed.belongsTo({name})
    expect(belongs)
      .to.be.false
  })

  it('should clear Timeout', () => {
    const feed = new Feed({name: 'lucas'})
    feed.start()
    feed.stop()
    const timer = feed.timer
    expect(timer)
      .to.be.null
  })
  it('should set Timeout', () => {
    const feed = new Feed({}, {name: 'lucas'})
    feed.start()
    expect(feed.timer)
      .to.be.an('object')
      .to.have.property('_idleTimeout')
    expect(feed.timer._idleTimeout)
      .to.be.equal(30000)
    feed.stop()
  })

  it('should send messages', () => {
    const feed = new Feed({}, {name: 'lucas'})
    const spy = chai.spy()
    feed.on('message', spy)
    const payload1 = {
      a: 1,
      b: 2,
      c: 3,
    }
    const payload2 = ['a', 'b', 'c']
    const payload3 = 'assd'
    feed.emit('message', payload1)
    feed.emit('message', payload2)
    feed.emit('message', payload3)
    expect(spy)
      .on.nth(1).with(payload1)
      .on.nth(2).with(payload2)
      .on.nth(3).with(payload3)
  })

})
