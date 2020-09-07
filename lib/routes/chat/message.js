module.exports = class Message {

  create(data) {
    const message = data.message
    const roomId = parseFloat(data.roomId)
    const user = data.user
    const date = data.date
    if (!message) throw Error('Invalid data: Missing message')
    if (typeof message !== 'string') throw Error(`Invalid message, expected string but got ${typeof message}`)

    if (isNaN(roomId)) throw Error('Invalid room id, expected number but got NaN')

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
  getDate() {
    return this.data.date
  }
  getId() {
    return this.data.roomId
  }
}
