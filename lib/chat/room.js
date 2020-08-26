const Feed = require('./feed')
/*
*/
let ID = 0
module.exports = class Room {
  constructor() {
    this.feeds = []
    this.id = ID += 1
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
   * @return {boolean || Error} `true` if the feed was removed
   */
  removeFeed(feedToRemove) {
    const index = this.feeds.findIndex(feed => feed.getUser() === feedToRemove.user)
    if (index >= 0) {
      return Boolean(this.feeds.splice(index, 1))
    }
    throw new Error('invalid feed')
  }
}
