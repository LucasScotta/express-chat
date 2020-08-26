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
  getRooms() {
    return this.rooms
  }
  /**
   * @param {Room} room
   * @return {boolean} `true` if the room was removed
   */
  removeRoom(room) {

    const index = this.rooms.indexOf(room)
    const found = index >= 0
    if (found) {
      this.rooms.splice(index, 1)
    }
    return found
  }
}
