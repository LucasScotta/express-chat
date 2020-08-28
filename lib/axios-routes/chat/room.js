const Feed = require('./feed')
const util = require('./util')
/*
*/
module.exports = class Room {
  constructor(user) {
    this.feeds = []
    this.id = util.ID += 1
    this.msgs = []
    this.administrator = user.name
    this.displayMsg = null
  }
  getId() {
    return this.id
  }
  /**
   * @param {?} user
   * @return {Feed}
   */
  addUser(user) {
    if (!user) {
      throw new Error('Invalid argument, expected user')
    }

    const oldFeed = this.feeds.find(feed => feed.belongsTo(user))
    if (oldFeed) {
      return oldFeed
    }

    const feed = new Feed(user)
    this.feeds.push(feed)
    return feed
  }
  /**
   * @param {?} user
   * @return {boolean} `true` if the user was found
   */
  hasUser(user) {
    return Boolean(this.feeds.find(feed => feed.belongsTo(user)))
  }
  /**
   * @return {users}
   */
  getUsers() {
    return this.feeds.map(feed => feed.getUser())
  }
  /**
   * @param {?} user
   * @return {boolean} `true` if the user was removed
   */
  removeUser(user) {
    const index = this.feeds.findIndex(feed => feed.belongsTo(user))
    const found = index >= 0
    if (found) {
      this.feeds.splice(index, 1)
    }
    return found
  }
  /**
   * @param {?} feed
   * @return {boolean} `true` if the feed was removed
   *
   * @throw {Error} when the feed is invalid
   */
  removeFeed(feedToRemove) {
    const index = this.feeds.findIndex(feed => feed.getUser() === feedToRemove.user)
    if (index >= 0) {
      return Boolean(this.feeds.splice(index, 1))
    }
    throw new Error('invalid feed')
  }
  /**
   * @param {?} msg
   */
  publishMessage(msg) {
    this.msgs.push(msg)
  }
  /**
   * @return {msgs}
   */
  getMessages() {
    return this.msgs
  }
  /**
   * @return {Boolean} `true` if at least a msg was deleted
   */
  deleteMessages() {
    const indexes = []
    let deletedMsgs = 0
    this.msgs.forEach((msg, index) => {
      if (msg.sent >= this.feeds.length) {
        indexes.unshift(index)
      }
    })
    if (indexes.length > 0) {
      indexes.forEach(index => {
        this.msgs.splice(index, 1)
        deletedMsgs += 1
      })
    }
    return Boolean(deletedMsgs)
  }
  /**
   * @return {administrator}
   */
  getAdmin() {
    return this.administrator
  }
  /**
    * @param {?} msg to display
    * @return {displayMsg} if the msg was updated
    *
    * @throw {Error} when the msg wasn't updated
    */
  setDisplayMessage(msg) {
    if (typeof msg === 'string' && msg.length < util.maxMsgLength) {
      this.displayMsg = msg
      return this.displayMsg
    }
    throw new Error('El mensaje debe contener menos de 64 caracteres')
  }
}
