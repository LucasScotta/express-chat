const Room = require('./room')
const fs = require('fs')
const dir = __dirname + /rooms/
const util = require('./util')
/*
*/
module.exports = class Chat {
  constructor() {
    this.rooms = []
  }
  /**
   * @return {Room}
   */
  createRoom(options, callback) {

    const room = new Room(options)
    fs.appendFile(dir + room.getId() + '.json', JSON.stringify({id: room.getId(), suscriptors: room.getSuscriptors(), displayMessage: room.getDisplayMessage(), feedOptions: options}), (err) => {
      if (err) {
        return callback(err)
      }
      else {
        this.rooms.push(room)
        callback(null, room)
      }
    })
  }
  /**
   * @param {object} timeout
   * @param {function} callback
   * @return {err} if there is nothing to read
   * @return {rooms} If there are written rooms
   */
  readRooms(timeout, callback) {
    const rooms = []
    const read = (id) => {
      fs.readFile(dir + id + '.json', (err, obtainedRoom) => {
        if (err) {
          if (rooms.length > 0) {
            return callback(null, this.rooms)
          }
          return callback(err)
        }
        else {
          const room = JSON.parse(obtainedRoom)
          const newRoom = new Room(timeout)
          newRoom.setProperties(room.id, room.suscriptors, room.displayMessage, room.feedOptions)
          this.rooms.push(newRoom)
          rooms.push(newRoom)
          read(util.ID)
        }
      })
    }
    read(util.ID)
  }
  /**
   * @param {number} id
   * @return {room || null}
   */
  getRoom(id) {
    return this.rooms.find(room => room.getId() === parseInt(id)) || null
  }
  /**
   * @param {number} id
   * @return {rooms}
   */
  getRooms() {
    return this.rooms
  }
  /**
   * @param {string} msg
   * @param {number} roomId
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
