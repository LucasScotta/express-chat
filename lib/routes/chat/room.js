const Feed = require('./feed')
const util = require('./util')
/*
*/
module.exports = class Room {
  constructor(user) {
    this.feeds = []
    this.id = util.ID += 1
    this.administrator = user.name
    this.suscriptors = []
    this.displayMessage = null
  }
  getId() {
    return this.id
  }
  /**
   * @param {?} user
   * @return {Feed}
   */
  addUser(user) {
    if (!user.name) {
      throw new Error(`Invalid argument expected string, but got ${typeof user.name}`)
    }

    const oldFeed = this.feeds.find(feed => feed.belongsTo(user.name))
    if (oldFeed) {
      this.feeds.push(oldFeed)
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
    return Boolean(this.feeds.find(feed => feed.belongsTo(user.name)))
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
   * @param {object} msg
   * @param {object} msg
   */
  publishMessage(data) {
    if(data.roomId !== this.id) return
    const feeds = []
    for (const feed of this.feeds) {
      feed.publishMessage(data)
      feeds.push(feed)
    }
    while (feeds.length > 0) {
      const feed = feeds.pop()
      this.removeFeed(feed)
    }
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
  setDisplayMessage(message) {
    if (typeof message === 'string' && message.length < util.maxMessageLength) {
      this.displayMessage = message
      return this.displayMessage
    }
    throw new Error('El mensaje debe contener menos de 64 caracteres')
  }
}
