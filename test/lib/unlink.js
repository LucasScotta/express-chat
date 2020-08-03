const fs = require('fs')

module.exports = (path, next) => {
    fs.unlink(path, (err) => {
      if(err && err.code !== 'ENOENT') next(err)
      else next()
    })
  }
