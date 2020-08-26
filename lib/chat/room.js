const Feed = require('./feed')
/*
1 Permitir que usuarios entren a la sala
2 Listar usuario conectados a la sala
3 Permitir que usuarios salgan de la sala





Dar Vader => luke
Dar Vader => Leia
const Vader = {
  hijos: [luke, leia]
}

luke => Dar Vader
const luke = {
  padre: Vader
}


Permitir que los usuarios envien mensajes
Asignar un moderador de sala
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
  hasUser(user) {
    return Boolean(this.feeds.find(feed => feed.belongsTo(user)))
  }
  getUsers() {
    return this.feeds.map(feed => feed.getUser())
  }
  removeUser(user) {
    const index = this.feeds.findIndex(feed => feed.belongsTo(user))
    const found = index >= 0
    if (found) {
      this.feeds.splice(index, 1)
    }
    return found
  }
}
