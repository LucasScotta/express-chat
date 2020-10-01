const Room = require('../../../lib/routes/chat/room')
const Feed = require('../../../lib/routes/chat/feed')
const timeout = {timeoutInMillis: 10}
describe('/lib/routes/chat/room', () => {
  it('should auto-assign room ids', () => {
    const room1 = new Room(timeout)
    const room2 = new Room(timeout)
    const id1 = room1.getId()
    const id2 = room2.getId()
    expect(id1)
      .to.be.a('number')
      .to.be.below(id2)
  })

  it('should add an user', () => {
    const room = new Room(timeout)
    const user = {name: 'lucas'}
    const feed = room.addUser(user)
    expect(feed)
      .to.be.instanceof(Feed)
  })
  it('should return the display message', () => {
    const room = new Room(timeout)
    const displayMsg = 'agradecido con el de arriba'
    room.setDisplayMessage(displayMsg)
    const result = room.getDisplayMessage()
    expect(result)
      .to.be.a('string')
      .to.be.equal(displayMsg)
  })
  it('should throw on invalid user', () => {
    const room = new Room(timeout)
    const call = () => room.addUser(undefined)
    expect(call)
      .to.throw(Error)
  })
  it('should add an user twice', () => {
    const room = new Room(timeout)
    const f1 = room.addUser({name: 'pepe'})
    const f2 = room.addUser({name: 'pepe'})
    expect(f2.name)
      .to.be.equal(f1.name)
  })

  it('should have user', () => {
    const room = new Room(timeout)
    const feed = room.addUser({name:'lucas'})
    feed.start()
    const result = room.hasUser({name:'lucas'})
    expect(result)
      .to.be.true
  })
  it('should not have an user', () =>{
    const room = new Room(timeout)
    const result = room.hasUser({name:'lucas'})
    expect(result)
      .to.be.false
  })

  it('should list the users', () => {
    const room = new Room(timeout)
    const user1 = 'lucas'
    const user2 = 'martin'
    const feed1 = room.addUser({name: user1})
    const feed2 = room.addUser({name: user2})
    feed1.start()
    feed2.start()
    const users = room.getUsers()
    expect(users)
      .to.be.an('array')
      .to.have.length(2)
      .to.have.members([user2, user1])
  })

  it('should remove a non existing user', () => {
    const room = new Room(timeout)
    const removed = room.removeUser('user')
    expect(removed)
      .to.be.false
  })
  it('should remove an existing feed', () => {
    const room = new Room(timeout)
    const feed = room.addUser({name:'lucas'})
    feed.start()
    feed.stop()
    expect(room.hasUser({name:'lucas'}))
      .to.be.true
  })
  it('should remove all feeds', () => {
    const room = new Room(timeout)
    const feed1 = room.addUser({name: 'a'})
    const feed2 = room.addUser({name: 'b'})
    const feed3 = room.addUser({name: 'c'})
    const feed4 = room.addUser({name: 'd'})
    const feeds = [feed1, feed2, feed3, feed4]
    feeds.forEach(feed => feed.start())
    feeds.forEach(feed => room._removeFeed(feed))
    room._removeFeeds()
    expect(room.feeds)
      .to.be.an('array')
      .to.have.length(0)
  })

  it('should throw on invalid feed', () => {
    const room1 = new Room(timeout)
    const room2 = new Room(timeout)
    const feed = room1.addUser({name:'lucas'})
    const call = () => room2._removeFeed(feed)
    expect(call)
      .to.throw(/invalid feed/)
  })

  it('should add a new msg', () => {
    const room = new Room(timeout)
    const feed = room.addUser({name:'lucas'})
    feed.start()
    const msg = {roomId: room.getId()}
    let recieved
    feed.on('message', (message) => recieved = message)
    room.publishMessage(msg)
    expect(recieved)
      .to.be.equal(msg)
  })
  it('should return suscriptors', () => {
    const room = new Room(timeout)
    const maria = 'maria'
    const jose = 'jose'
    const jesus = 'jesus'
    room.addUser({name: maria})
    room.addUser({name: jose})
    room.addUser({name: jesus})
    const suscriptors = room.getSuscriptors()
    expect(suscriptors)
      .to.be.an('array')
      .to.have.members([maria, jose, jesus])
      .to.have.length(3)
  })
  it('should return if is suscriptor', () => {
    const room = new Room(timeout)
    room.addUser({name: 'lucas'})
    const suscriptor = room.isSuscriptor('lucas')
    const notSuscriptor = room.isSuscriptor('pepito')
    expect(suscriptor)
      .to.be.true
    expect(notSuscriptor)
      .to.be.false
  })

  it('should change the display msg of the Room', () => {
    const room = new Room(timeout)
    const msg = 'soy un Room'
    const displayMsg = room.setDisplayMessage(msg)
    expect(displayMsg)
      .to.be.equal(msg)
  })
  it('should throw on max length msg overpassed', () => {
    const room = new Room(timeout)
    const msg = 'asdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasdaasdasdasdasdas'
    const call = () => room.setDisplayMessage(msg)
    expect(call)
      .to.throw(/El mensaje debe contener menos de 64 caracteres/)
  })

  describe('setProperties', () => {
    it('should set properties of the room', () => {
      const room = new Room(timeout)
      const id = '1'
      const suscriptors = []
      const displayMessage = 'Mensaje de presentacion'
      const feedOptions = {timeoutInMillis:30000}
      const properties = room.setProperties(id,suscriptors,displayMessage, feedOptions)
      expect(properties).to.be.equal(room)
      expect(room.getId()).to.be.equal(parseInt(id))
      expect(room.getSuscriptors()).to.be.equal(suscriptors)
      expect(room.getDisplayMessage()).to.be.equal(displayMessage)
      expect(room.feedOptions).to.be.equal(feedOptions)
    })
    it('should throw on invalid id', () => {
      const room = new Room(timeout)
      const id = 'asd'
      const suscriptors = []
      const displayMessage = 'asd'
      const feedOptions = {timeoutInMillis:30000}
      const properties = room.setProperties(id,suscriptors,displayMessage,feedOptions)
      expect(properties).to.match(/Expected number, but got/)
    })
    it('should throw on invalid suscriptors', () => {
      const room = new Room(timeout)
      const id = 1
      const suscriptors = '[]'
      const displayMessage = 'asd'
      const feedOptions = {timeoutInMillis:30000}
      const properties = room.setProperties(id,suscriptors,displayMessage,feedOptions)
      expect(properties).to.match(/Expected object, but got/)
    })
    it('should throw on invalid displayMessage', () => {
      const room = new Room(timeout)
      const id = 1
      const suscriptors = []
      const displayMessage = {}
      const feedOptions = {timeoutInMillis:30000}
      const properties = room.setProperties(id,suscriptors,displayMessage,feedOptions)
      expect(properties).to.match(/Expected string, but got object/)
    })
    it('should throw on invalid feedOptions', () => {
      const room = new Room(timeout)
      const id = 1
      const suscriptors = []
      const displayMessage = 'asd'
      const feedOptions = '{timeoutInMillis:30000}'
      const properties = room.setProperties(id,suscriptors,displayMessage,feedOptions)
      expect(properties).to.match(/Expected object, but got string/)
    })
  })
})

console.log('---------------------------------------------------------------------')
