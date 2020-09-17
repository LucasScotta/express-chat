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
    return this.rooms.find(room => room.getId() === parseInt(id)) || null
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
  sendMessage(data) {

    const room = this.getRoom(data.roomId)

    if (!data.message) throw Error(`Invalid message, expected string but got ${typeof message}`)
    if(typeof data.roomId !== 'number') throw Error(`Invalid room ID: Expected number but got ${typeof data.roomId}`)
    if (!data.roomId) throw Error(`Invalid room ID`)
    if (!room) throw Error(`Invalid room, expected Object but got ${typeof room}`)

    room.publishMessage(data)
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
