const Room = require('../../../lib/routes/chat/room')
const Feed = require('../../../lib/routes/chat/feed')

describe('/lib/routes/chat/room', () => {
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
    const user = {name: 'lucas'}
    const feed = room.addUser({}, user)
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
    const f1 = room.addUser({}, {name: 'pepe'})
    const f2 = room.addUser({}, {name: 'pepe'})
    expect(f2.name)
      .to.be.equal(f1.name)
  })

  it('should have user', () => {
    const room = new Room({name: 'lucas'})
    room.addUser({}, {name:'lucas'})
    const result = room.hasUser({name:'lucas'})
    expect(result)
      .to.be.true
  })
  it('should not have an user', () =>{
    const room = new Room({name: 'lucas'})
    const result = room.hasUser({name:'lucas'})
    expect(result)
      .to.be.false
  })

  it('should list the users', () => {
    const room = new Room({name: 'lucas'})
    const user1 = 'lucas'
    const user2 = 'martin'
    room.addUser({}, {name: user1})
    room.addUser({}, {name: user2})
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
  it('should remove an existing feed', () => {
    const room = new Room({name: 'lucas'})
    const feed = room.addUser({}, {name:'lucas'})
    room.removeFeed(feed)
    expect(room.hasUser({name:'lucas'}))
      .to.be.false
  })
  it('should throw on invalid feed', () => {
    const room1 = new Room({name: 'lucas'})
    const room2 = new Room({name: 'lucas'})
    const feed = room1.addUser({}, {name:'lucas'})
    const call = () => room2.removeFeed(feed)
    expect(call)
      .to.throw(/invalid feed/)
  })

  it('should add a new msg', () => {
    const room = new Room({name: 'lucas'})
    const feed = room.addUser({}, {name:'lucas'})
    const msg = {roomId: room.getId()}
    let recieved
    feed.on('message', (message) => recieved = message)
    room.publishMessage(msg)
    expect(recieved)
      .to.be.equal(msg)
  })

  it('should return the room administrator', () => {
    const room = new Room({name: 'lucas'})
    const adm = room.getAdmin()
    expect(adm)
      .to.be.a('string')
  })

  it('should change the display msg of the Room', () => {
    const room = new Room({name: ''})
    const msg = 'soy un Room'
    const displayMsg = room.setDisplayMessage(msg)
    expect(displayMsg)
      .to.be.equal(msg)
  })
  it('should throw on max length msg overpassed', () => {
    const room = new Room({name: ''})
    const msg = 'asdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasdasdas'
    const call = () => room.setDisplayMessage(msg)
    expect(call)
      .to.throw(/El mensaje debe contener menos de 64 caracteres/)
  })
})

console.log('---------------------------------------------------------------------')
