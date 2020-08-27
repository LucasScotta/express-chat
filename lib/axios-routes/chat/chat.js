const Room = require('./room')
/*
*/
module.exports = class Chat {
  constructor() {
    this.rooms = []
  }
  /**
   * @return {Room}
   */
  createRoom() {

    const room = new Room()
    this.rooms.push(room)
    return room
  }
  /**
   * @param {?} id
   * @return {room || null}
   */
  getRoom(id) {
    return this.rooms.find(room => room.getId() === id) || null
  }
  getRooms() {
    return this.rooms
  }
  sendMsg(msg, id) {
    if (!this.getRoom(id) || !msg) {
      throw new Error('Esperaba un mensaje e ID valido')
    }
    this.getRoom(id).newMsg(msg)
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
