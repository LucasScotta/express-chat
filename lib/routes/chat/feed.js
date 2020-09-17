// const Chat = require('./chat')
const EventEmitter = require('events')
const util = require('./util')
/*
*/
module.exports = class Feed extends EventEmitter {

  constructor(client, user) {
    super()
    this.user = user.name
    this.resp = client.resp
    this.req = client.req
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
  start() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => this._onTimeout(), this.timeoutInMillis)
    this.emit('start')
  }
  stop() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    this.emit('end')
  }
  _onTimeout() {
    this.emit('timeout')
  }
}
