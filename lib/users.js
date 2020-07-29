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
        fs.appendFile(path, JSON.stringify({pass}), (err) => {
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
          if (err) return callback(err)

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
      if(err) callback(err)
      else readFile(path, callback)
    })
  },
})