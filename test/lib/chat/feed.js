const Feed = require('../../../lib/chat/feed')

describe('/lib/chat/feed', () => {
  it('should return its user', () => {
    const user = 'lucas'
    const feed = new Feed(user)
    const result = feed.getUser()
    expect(result)
      .to.be.equal(user)
  })

}
