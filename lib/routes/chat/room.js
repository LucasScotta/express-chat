const Feed = require('./feed')
const util = require('./util')
/*
*/
module.exports = class Room {
  constructor(feedOptions) {
    this.feeds = []
    this.toRemove = []
    this.id = util.ID
    this.suscriptors = []
    this.displayMessage = ""
    this.feedOptions = feedOptions
    util.ID += 1
  }
  getId() {
    return this.id
  }
  /**
   * @params {number, object, string, object} id, suscriptors, displayMessage, feedOptions
   * @return {this} Room
   * @throw {Error} when a param is bad
   */
  setProperties(ID,suscriptors,displayMessage, feedOptions) {
    const id = parseInt(ID)
    if (!id || typeof id !== 'number') {
      return Error(`Expected number, but got ${typeof number}`)
    }
    if (!suscriptors || typeof suscriptors !== 'object') {
      return Error(`Expected object, but got ${typeof suscriptors}`)
    }
    if (typeof displayMessage !== 'string') {
      return Error(`Expected string, but got ${typeof displayMessage}`)
    }
    if (!feedOptions || typeof feedOptions !== 'object') {
      return Error(`Expected object, but got ${typeof feedOptions}`)
    }
    this.id = id
    this.suscriptors = suscriptors
    this.setDisplayMessage(displayMessage)
    this.feedOptions = feedOptions
    return this
  }
  /**
   * @param {object} user
   * @return {Feed}
   */
  addUser(user) {
    if (!user.name) {
      throw new Error(`Invalid argument expected string, but got ${typeof user.name}`)
    }
    this.isNew(user)
    const feed = new Feed({timeoutInMillis: this.feedOptions.timeoutInMillis, userName: user.name})

    feed.on('start', () => {
      this.feeds.push(feed)
    })
    feed.on('end', (timeout) => {
      this._removeFeed(feed, timeout ? timeout : null)
    })
    return feed
  }
  /**
   * @param {object} user
   * @return {boolean} `true` if the user was found
   */
  hasUser(user) {
    return Boolean(this.feeds.find(feed => feed.belongsTo(user.name)))
  }
  /**
   * @param {object} user
   * @return {boolean} `true` if the user is new in this room
   */
  isNew(user) {
    let isNew = true
    this.suscriptors.forEach(suscriptor => {
      if (suscriptor === user.name) {
        isNew = false
      }
    })
    if(isNew) {
      this.suscriptors.push(user.name)
    }
    return isNew
  }
  /**
   * @return {array} suscriptors
   */
  getSuscriptors() {
    return this.suscriptors
  }
  /**
   *
   */
  isSuscriptor(userName) {
    return Boolean(this.suscriptors.find(suscriptor => suscriptor === userName))
  }
  /**
   * @return {users}
   */
  getUsers() {
    return this.feeds.map(feed => feed.getUser())
  }
  /**
   * @param {object} user
   * @return {boolean} `true` if the user was removed
   */
  removeUser(user) {
    const index = this.feeds.findIndex(feed => feed.belongsTo(user.name))
    const found = index >= 0
    if (found) {
      this.feeds.splice(index, 1)
    }
    return found
  }
  /**
   * @param {object} feed
   * @return {boolean} `true` if the feed was removed
   *
   * @throw {Error} when the feed is invalid
   */
  _removeFeed(feedToRemove, timeout) {
    if (timeout) {
      const index = this.feeds.findIndex(feed => feed.getUser() === feedToRemove.user)
      if (index >= 0) {
       return Boolean(this.feeds.splice(index, 1))
      }
    }
    const index = this.feeds.findIndex(feed => feed.getUser() === feedToRemove.user)
    if (index >= 0) {
      return Boolean(this.toRemove.push(this.feeds[0]))
    }
    throw new Error('invalid feed')
  }
  _removeFeeds() {
    if (this.toRemove.length === this.feeds.length) {
      this.toRemove.length = 0
      return this.feeds.length = 0
    }
  }
  /**
   * @param {object} msg
   * @param {object} msg
   */
  publishMessage(data) {
    if(data.roomId !== this.id) throw Error(`ID room invalid, ${data.roomId} is not from this room`)

    this.feeds.forEach(feed => {
      feed.publishMessage(data)
    })
    this._removeFeeds()
  }
  /**
    * @param {string} msg to display
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
  /**
   * @return {string} if the msg was updated
   */
   getDisplayMessage() {
    return this.displayMessage
   }
}
