const Feed = require('../../../lib/axios-routes/chat/feed')

describe('/lib/chat/feed', () => {
  it('should return its user', () => {
    const user = 'lucas'
    const feed = new Feed(user)
    const result = feed.getUser()
    expect(result)
      .to.be.equal(user)
  })

  it('should belong to user', () => {
    const user = 'lucas'
    const feed = new Feed(user)
    const belongs = feed.belongsTo(user)
    expect(belongs)
      .to.be.true
  })

  it('should not belong to user', () => {
    const user = 'lucas'
    const feed = new Feed('martin')
    const belongs = feed.belongsTo(user)
    expect(belongs)
      .to.be.false
  })

  it('should delete listeners', () => {
    const feed = new Feed('lucas')
    feed.on('send-message', () => console.log())
    feed.stop()
    expect(feed.emit('send-message'))
      .to.be.false
  })

  it('should send messages', () => {
    const feed = new Feed('lucas')
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
