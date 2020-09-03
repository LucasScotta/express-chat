module.exports = class Message {

  create(data) {
    const message = data.message
    const roomId = data.roomId
    const user = data.user
    const date = data.date
    if (!message) throw Error(`Invalid message, expected string but got null`)
    if (typeof message !== 'string') throw Error(`Invalid message, expected string but got ${typeof message}`)

    if(!roomId) throw Error('Invalid data: Missing room id')
    if (typeof roomId != 'number') throw Error(`Invalid room id, expected number but got ${typeof roomId}`)

    if (!user) throw Error('Invalid data: Missing user')
    if (typeof user !== 'string') throw Error(`Invalid user, expected string but got ${typeof user}`)

    if (!date) throw Error('Invalid data: Missing Date')
    if (typeof date !== 'number') throw Error(`Invalid date, expected number but got ${typeof date}`)
    if (date > Date.now()) throw Error('Invalid date, message sent from the future')

    this.data = data
    return this.data
  }
  getData() {
    return this.data
  }
  getUser() {
    return this.data.user
  }
  getMessage() {
    return this.data.message
  }
  getId() {
    return this.data.roomId
  }
}
