// const Chat = require('./chat')
const EventEmitter = require('events')

module.exports = class Feed extends EventEmitter {

  constructor(user) {
    super()
    this.user = user
  }
  getUser() {
    return this.user
  }
}
