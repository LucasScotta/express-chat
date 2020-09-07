const feed = require('./chat/feed')

module.exports = (req, resp) => {
    console.log('feed', feed)
    resp.sendStatus(200)
  }
