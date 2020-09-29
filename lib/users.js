const fs = require('fs')
const readFile = (path, callback) => {
  fs.readFile(path, (err, buffer) => {
    if (err) return callback(err)
    try {
      const obj = JSON.parse(buffer)
      callback(null, obj)
    }
    catch(e) {
      callback(e)
    }
  })
}

const toPath = (path, id) => {
  return `${path}/${id}.json`
}

module.exports = (options) => ({
  /**
   * Crea un usuario y lo agrega
   */
  add: function(id, pass, callback) {
    const path = toPath(options.path, id)
    fs.exists(path, (exists) => {
      if(!exists) {
        fs.appendFile(path, JSON.stringify({pass, blockeds: [], silenced: []}), (err) => {
          if(err) callback(err)
          else {
            readFile(path, callback)
          }
        })
      }
      else callback(new Error('El usuario ya existe'))
    })
  },
  /**
   * Si el usuario y el password son correctos devuelve true
   */
  getByPass: function(id, pass, callback) {
    const path = toPath(options.path, id)
    fs.exists(path, (exists) => {
      if(!exists) {
        callback(new Error('Usuario o contrasena incorrectos'))
      }
      else {
        readFile(path, (err, user) => {
          if (err) {
            return callback(err)
          }
          if (user && user.pass === pass) {

            return callback(null, user)
          }
          if (user && user.pass !== pass) {
            return callback(new Error('Usuario o contrasena incorrectos'))
          }
        })
      }
    })
  },
  get: function(id, callback) {
    const path = toPath(options.path, id)
    fs.stat(path, (err) => {
      if(err) {
        callback(new Error('Lo sentimos, el usuario no existe'))
      }
      else readFile(path, callback)
    })
  },
  mute: function(id, idToSilence, callback) {
    const path = toPath(options.path, id)
    if (id === idToSilence) return callback(new Error('No podes silenciarte a vos mismo'))

    readFile(path, (err, user) => {
      if (err) {
        return callback(err)
      }

      const index = user.silenced.findIndex(silenced => silenced === idToSilence)
      if (index >= 0) {
        user.silenced.splice(index, 1)
        fs.writeFile(path, JSON.stringify({pass:user.pass,blockeds:user.blockeds,silenced:user.silenced}), err => {
          if (err) return callback(err)
        })
      }
      else {
        user.silenced.push(idToSilence)
        fs.writeFile(path, JSON.stringify({pass:user.pass,blockeds:user.blockeds,silenced:user.silenced}), err => {
          if (err) return callback(err)
        })
      }
      return callback(null, user.silenced)
    })
  },
  getMuted: function(id, callback) {
    const path = toPath(options.path, id)
    fs.exists(path, exists => {
      if (!exists) return callback(new Error('Usuario invalido'))
        readFile(path, (err, user) => {
          if (err) return callback(err)
          return callback(null, user.silenced)
        })
    })
  },
  block: function(id, idToBlock, callback) {
    const path = toPath(options.path, id)
    if (id === idToBlock) return callback(new Error('No podes bloquearte a vos mismo'))

    readFile(path, (err, user) => {
      if (err) {
        return callback(err)
      }

      const index = user.blockeds.findIndex(blocked => blocked === idToBlock)
      if (index >= 0) {
        user.blockeds.splice(index, 1)
        fs.writeFile(path, JSON.stringify({pass:user.pass,blockeds:user.blockeds,silenced:user.silenced}), err => {
          if (err) return callback(err)
        })
      }
      else {
        user.blockeds.push(idToBlock)
        fs.writeFile(path, JSON.stringify({pass:user.pass,blockeds:user.blockeds,silenced:user.silenced}), err => {
          if (err) return callback(err)
        })
      }
      return callback(null, user.blockeds)
    })
  },
  getBlocked: function(id, callback) {
    const path = toPath(options.path, id)
    fs.exists(path, exists => {
      if (!exists) return callback(new Error('Usuario invalido'))
        readFile(path, (err, user) => {
          if (err) return callback(err)
          return callback(null, user.blockeds)
        })
    })
  },
})
