// const Chat = require('./chat')
const EventEmitter = require('events')
const util = require('./util')
/*
*/
module.exports = class Feed extends EventEmitter {

  constructor(user) {
    super()
    this.user = user.name
  }
  /**
   * @return {user}
   */
  getUser() {
    return this.user
  }
  /**
   * @param {string} user
   * @return {boolean} `true` if the user matches
   */
  belongsTo(user) {
    return this.user === user
  }
  /**
   * @param {object} msg
   */
  publishMessage(msg) {
    this.emit('message', msg)
  }
  start(resp, room) {
    if (this.timer) {
      this.stop()
    }
    this.timer = setTimeout(() => this.emit('timeout'), util.maxWait * 1000)
    this.on('message', (message) => {
      resp.send(message)
      this.stop()
    })
    this.on('timeout', () => {
      resp.sendStatus(200)
      room.removeFeed(this)
    })
    return this.timer
  }
  stop() {
    clearTimeout(this.timer)
    return this.timer
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
