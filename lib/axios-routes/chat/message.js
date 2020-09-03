module.exports = class Message {
  create(data) {
    const message = data.message
    const roomId = data.roomId
    if (!message) throw Error(`Invalid message, expected string but got null`)
    if (typeof message !== 'string') throw Error(`Invalid message, expected string but got ${typeof message}`)

    if(!roomId) throw Error('invalid data: missing room id')
    if (typeof roomId != 'number') throw Error(`Invalid room id, expected number but got ${typeof roomId}`)

    if (data.message && roomId) {
      this.data = data
      return this.data
    }
  }
}
