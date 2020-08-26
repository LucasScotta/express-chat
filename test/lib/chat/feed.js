const Feed = require('../../../lib/chat/feed')

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
}
