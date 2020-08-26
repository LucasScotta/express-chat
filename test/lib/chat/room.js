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

  it('should add an user', () => {
    const room = new Room()
    const user = 'lucas'
    const feed = room.addUser(user)
    expect(feed)
      .to.be.instanceof(Feed)
  })
  it('should throw on invalid user', () => {
    const room = new Room()
    const call = () => room.addUser(undefined)
    expect(call)
      .to.throw(Error)
  })

  it('should have user', () => {
    const room = new Room()
    room.addUser('lucas')
    const result = room.hasUser('lucas')
    expect(result)
      .to.be.true
  })
  it('should not have an user', () =>{
    const room = new Room()
    const result = room.hasUser('lucas')
    expect(result)
      .to.be.false
  })

  it('should list the users', () => {
    const room = new Room()
    const user1 = 'lucas'
    const user2 = 'martin'
    room.addUser(user1)
    room.addUser(user2)
    const users = room.getUsers()
    expect(users)
      .to.be.an('array')
      .to.have.length(2)
      .to.have.members([user2, user1])
  })

  it('should remove a non existing user', () => {
    const room = new Room()
    const removed = room.removeUser('user')
    expect(removed)
      .to.be.equal(false)
  })
  it('should remove an existing user', () => {
    const room = new Room()
    const user = 'olivia'
    room.addUser(user)
    const removed = room.removeUser(user)
    expect(removed)
      .to.be.equal(true)
  })

  it('should remove an existing feed', () => {
    const room = new Room()
    const feed = room.addUser('lucas')
    room.removeFeed(feed)
    expect(room.hasUser('lucas'))
      .to.be.false
  })
  it('should try to remove a non existing feed and return error', () => {
    const room1 = new Room()
    const room2 = new Room()
    const feed = room1.addUser('lucas')
    const call = () => room2.removeFeed(feed)
    expect(call)
      .to.throw(/invalid feed/)
  })
}
