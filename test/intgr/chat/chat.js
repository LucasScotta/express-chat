const Chat = require('../../../lib/routes/chat')()
const Message = require('../../../lib/routes/chat/message')
const timeout = {timeoutInMillis: 30000}
xdescribe('intgr/chat', () => {
  it('should send msg to all the feeds', () => {
    const chat = new Chat()
    const message = new Message()
    chat.createRoom(timeout, (err, room) => {
      const roomId = room.getId()
      const msg = message.create({message: 'hola', roomId, user: 'lucas', date: Date.now()})
      const feed1 = room.addUser('a')
      const feed2 = room.addUser('b')
      chat.sendMessage(msg)
      feed1.on('message', () => {})
      feed1.emit('message')
      feed2.on('message', () => {})
    })
  })
})
