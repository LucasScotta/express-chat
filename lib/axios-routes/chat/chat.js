const Room = require('./room')
/*
*/
module.exports = class Chat {
  constructor() {
    this.rooms = [new Room({name: ''})]
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
    return this.rooms.find(room => room.getId() === id) || null
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
   * @param {?} id
   * @throw {Error} if !id or !msg
   */
  sendMessage(msg, id) {
    if (!this.getRoom(id) || !msg) {
      throw new Error('Esperaba un mensaje e ID valido')
    }
    this.getRoom(id).publishMessage(msg)
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
