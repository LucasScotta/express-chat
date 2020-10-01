const Chat = require('../../../lib/routes/chat')()
const Room = require('../../../lib/routes/chat/room')
const timeout = {timeoutInMillis: 30000}

describe('lib/routes/chat.js', () => {
  it('should create a room', () => {
    const chat = new Chat()
    chat.createRoom(timeout, (err, room) => {
      expect(err).to.be.null
      expect(room).to.be.instanceof(Room)
    })
  })

  it('should return an existing room', () => {
    const chat = new Chat()
    chat.createRoom(timeout, (err, room) => {
      const result = chat.getRoom(room.getId())
      expect(err).to.be.null
      expect(result).to.be.equal(room)
    })
  })
  it('should return a non existing room', () => {
    const chat = new Chat()
    const room = chat.getRoom(7)
    expect(room).to.be.null
  })

  it('should return created rooms', () => {
    const chat = new Chat()
    let r1
    let r2
    let r3
    chat.createRoom(timeout, (err1, room) => {
      r1 = room
      chat.createRoom(timeout, (err2, room) => {
        r2 = room
        chat.createRoom(timeout, (err3, room) => {
          r3 = room
          const rooms = chat.getRooms()
          expect(err1).to.be.null
          expect(err2).to.be.null
          expect(err3).to.be.null
          expect(rooms)
            .to.be.an('array')
            .to.have.length(3)
            .to.have.members([r1, r2, r3])
        })
      })
    })
  })

  it('should delete a room, existing', () => {
    const chat = new Chat()
    let r1
    let r2
    let r3
    chat.createRoom(timeout, (err1, room) => {
      r1 = room
      chat.createRoom(timeout, (err2, room) => {
        r2 = room
        chat.createRoom(timeout, (err3, room) => {
          r3 = room
          const removed = chat.removeRoom(r2)
          expect(removed)
            .to.be.equal(true)
          const rooms = chat.getRooms()
          expect(err1).to.be.null
          expect(err2).to.be.null
          expect(err3).to.be.null
          expect(rooms)
            .to.have.length(2)
            .to.have.members([r1, r3])
        })
      })
    })
  })
  it('should delete a room, non existing', () => {
    const chat1 = new Chat()
    const chat2 = new Chat()
    chat1.createRoom(timeout, (err, room) => {
      const removed = chat2.removeRoom(room)
      expect(err).to.be.null
      expect(removed).to.be.false
    })
  })

  it('should send a msg to the specified room', (done) => {
    const chat = new Chat()
    let msgRecieved
    chat.createRoom(timeout, (err, newRoom) => {
      const room = newRoom
      const feed = room.addUser({name:'lucas'})
      const roomId = room.getId()
      const message = { message: 'hola', roomId}
      feed.on('message', (message) => {
        msgRecieved = message
      })
      feed.start()
      chat.sendMessage(message, roomId)
      expect(err).to.be.null
      expect(message)
        .to.be.equal(msgRecieved)
      return done()
    })
  })
  it('should throw on invalid msg', () => {
    const chat = new Chat()
    chat.createRoom(timeout, (err, room) => {
      const roomId = room.getId()
      const result = () => chat.sendMessage({ message: null, roomId })
      expect(err).to.be.null
      expect(result)
        .to.throw(/Invalid message, expected string but got undefined/)
    })
  })
  it('should throw on invalid Id', () => {
    const chat = new Chat()
    const result = () => chat.sendMessage({message: 'hola', roomId: 'a'})
    expect(result)
      .to.throw(/Invalid room ID/)
  })
  it('should throw on invalid Room Id', () => {
    const chat = new Chat()
    chat.createRoom(timeout, (err, room) => {
      const roomId = room.getId()
      const result = () => chat.sendMessage({message: 'hola', roomdId: roomId + 1})
      expect(err).to.be.null
      expect(result)
        .to.throw(/Invalid room ID/)
    })
  })

  describe('readRooms', () => {
    it.only('should return all previous rooms', () => {
      const chat = new Chat()
      chat.readRooms(timeout, (err, rooms) => {
        expect(rooms).to.be.an('array')
        expect(chat.getRooms()).to.have.length(rooms.length)
        expect(err).to.be.null
      })
    })
  })
})
