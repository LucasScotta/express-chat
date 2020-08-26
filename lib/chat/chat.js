const Room = require('./room')

module.exports = class Chat {
  /**
   * @return {Room}
   */
  createRoom() {

    const room = new Room()
    this.rooms.push(room)
    return room
  }
}
