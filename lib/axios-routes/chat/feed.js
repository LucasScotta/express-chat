// const Chat = require('./chat')
const EventEmitter = require('events')
/*
*/
module.exports = class Feed extends EventEmitter {

  constructor(user) {
    super()
    this.user = user
  }
  /**
   * @return {user}
   */
  getUser() {
    return this.user
  }
  /**
   * @param {?} user
   * @return {boolean} `true` if the user matches
   */
  belongsTo(user) {
    return this.user === user
  }
  /**
   * @param {?} msg
   * @return {function}
   */
  publishMessage(msg) {
    this.emit('send-message', msg)
    this.removeAllListeners()
  }
}

/*
feed.on('message', (msg) => {
  feed.msgs.push(msg)
  feed.alertUsers()
})

feed.on('time-out', () => {
  setTimeout(() => feed.checkExpires(), 10 * 1000)
})

feed.on('error', (err, resp) => {
  if (err) resp.send(500)
})

feed.on('new-connection', (client) => {
  feed.newConnection(client)
})

feed.on('connection-0', (client) => {
  feed.oldMsgs(client)
})

feed.on('new-chat', (client) => {
  feed.start(client)
})

feed.on('send-msgs', () => {
  feed.sendMsgs()
})
*/
