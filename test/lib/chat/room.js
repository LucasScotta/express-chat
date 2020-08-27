const Room = require('../../../lib/axios-routes/chat/room')
const Feed = require('../../../lib/axios-routes/chat/feed')

describe('/lib/chat/room', () => {
  it('should auto-assign room ids', () => {
    const room1 = new Room({name: 'lucas'})
    const room2 = new Room({name: 'lucas'})
    const id1 = room1.getId()
    const id2 = room2.getId()
    expect(id1)
      .to.be.a('number')
      .to.be.below(id2)
  })

  it('should add an user', () => {
    const room = new Room({name: 'lucas'})
    const user = 'lucas'
    const feed = room.addUser(user)
    expect(feed)
      .to.be.instanceof(Feed)
  })
  it('should throw on invalid user', () => {
    const room = new Room({name: 'lucas'})
    const call = () => room.addUser(undefined)
    expect(call)
      .to.throw(Error)
  })
  it('should add an user twice', () => {
    const room = new Room({name: 'lucas'})
    const user = 'pepe'
    const f1 = room.addUser(user)
    const f2 = room.addUser(user)
    expect(f2)
      .to.be.equal(f1)
  })

  it('should have user', () => {
    const room = new Room({name: 'lucas'})
    room.addUser('lucas')
    const result = room.hasUser('lucas')
    expect(result)
      .to.be.true
  })
  it('should not have an user', () =>{
    const room = new Room({name: 'lucas'})
    const result = room.hasUser('lucas')
    expect(result)
      .to.be.false
  })

  it('should list the users', () => {
    const room = new Room({name: 'lucas'})
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
    const room = new Room({name: 'lucas'})
    const removed = room.removeUser('user')
    expect(removed)
      .to.be.equal(false)
  })
  it('should remove an existing user', () => {
    const room = new Room({name: 'lucas'})
    const user = 'olivia'
    room.addUser(user)
    const removed = room.removeUser(user)
    expect(removed)
      .to.be.equal(true)
  })

  it('should remove an existing feed', () => {
    const room = new Room({name: 'lucas'})
    const feed = room.addUser('lucas')
    room.removeFeed(feed)
    expect(room.hasUser('lucas'))
      .to.be.false
  })
  it('should try to remove a non existing feed and return error', () => {
    const room1 = new Room({name: 'lucas'})
    const room2 = new Room({name: 'lucas'})
    const feed = room1.addUser('lucas')
    const call = () => room2.removeFeed(feed)
    expect(call)
      .to.throw(/invalid feed/)
  })

  it('should add a new msg', () => {
    const room = new Room({name: 'lucas'})
    const msg = {}
    room.newMsg(msg)
    room.newMsg(msg)
    room.newMsg(msg)
    const msgs = room.getMsgs()
    expect(msgs)
      .to.be.an('array')
      .to.have.length(3)
      .to.have.members([msg, msg, msg])
  })

  it('should delete sent msgs', () => {
    const room = new Room({name: 'lucas'})
    const msg = {sent: 1}
    const msg2 = {sent: 0}
    room.addUser('lucas')
    room.newMsg(msg)
    room.newMsg(msg)
    room.newMsg(msg)
    room.newMsg(msg)
    room.newMsg(msg2)
    room.newMsg(msg2)
    const deleted = room.deleteMsgs()
    const msgs = room.getMsgs()
    expect(msgs)
      .to.have.length(2)
      .to.have.members([msg2, msg2])
    expect(deleted)
      .to.be.true
  })
  it('should not delete msgs', () => {
    const room = new Room({name: 'lucas'})
    const msg = {}
    room.newMsg(msg)
    room.newMsg(msg)
    room.newMsg(msg)
    room.newMsg(msg)
    const msgs = room.getMsgs()
    const deleted = room.deleteMsgs()
    expect(msgs)
      .to.have.length(4)
      .to.have.members([msg, msg, msg, msg])
    expect(deleted)
      .to.be.false
  })

  it('should return the room creator', () => {
    const room = new Room({name: 'lucas'})
    const adm = room.getAdmin()
    expect(adm)
      .to.be.a('string')
  })

  it('should change the display msg of the Room', () => {
    const room = new Room({name: ''})
    const msg = 'soy un Room'
    const displayMsg = room.updateDisplayMsg(msg)
    expect(displayMsg)
      .to.be.equal(msg)
  })
  it('should throw on max length msg overpassed', () => {
    const room = new Room({name: ''})
    const msg = 'asdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasdasdas'
    const displayMsg = () => room.updateDisplayMsg(msg)
    expect(displayMsg)
      .to.throw(Error)
  })
})

console.log('---------------------------------------------------------------------')
