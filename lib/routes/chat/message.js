module.exports = class Message {
  /**
   * @param {object} data's message
   * @return {object} data's message
   */
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
  /**
   * @return {object} data's message
   */
  getData() {
    return this.data
  }
  /**
   * @return {string} message's user
   */
  getUser() {
    return this.data.user
  }
  /**
   * @return {string} message
   */
  getMessage() {
    return this.data.message
  }
  /**
   * @return {number} message's date
   */
  getDate() {
    return this.data.date
  }
  /**
   * @return {number} message's room ID
   */
  getId() {
    return this.data.roomId
  }
}
