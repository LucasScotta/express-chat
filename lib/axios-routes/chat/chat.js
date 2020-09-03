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
  createRoom(user) {

    const room = new Room(user)
    this.rooms.push(room)
    return room
  }
  /**
   * @param {?} id
   * @return {room || null}
   */
  getRoom(id) {
    return this.rooms.find(room => room.getId() == id) || null
  }
  /**
   * @param {?} id
   * @return {rooms}
   */
  getRooms() {
    return this.rooms
  }
  /**
   * @param {?} msg
   * @param {?} roomId
   * @throw {Error} if !id or !msg
   */
  sendMessage(msg, roomId) {
    const room = this.getRoom(roomId)
    if (!msg) {
      throw Error(`Invalid message, expected object but got ${typeof msg}`)
    }
    if (!room) {
      throw Error(`Invalid room ID`)
    }
    room.publishMessage(msg)
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
