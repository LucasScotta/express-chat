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
  getRoom(id) {
    return this.rooms.find(room => room.getId() === id) || null
  }
}
