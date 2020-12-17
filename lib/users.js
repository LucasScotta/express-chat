const users = require('./psql/users')
const silences = require('./psql/silences')
const blocks = require('./psql/blocks')
const fs = require('fs')

const toPath = (path, id) => {
  return `${path}/${id}.json`
}

module.exports = (options) => ({
  /**
   * Crea un usuario y lo agrega
   */
  add: function(name, pass, callback) {
    users
      .findAll()
      .then(results => {
        for (const result of results) {
          const data = result.dataValues
          if (data.name === name) {
            return callback(new Error('Nombre de usuario en uso'))
          }
        }
        users
          .create({id: results.length + 1, name, pass})
          .then(result => {
            const data = result.dataValues
            if (data) {
              return callback(null, data)
            }
            return callback(new Error('Server internal error'))
          })
          .catch(err => callback(err))
      })
  },
  /**
   * Elimina el usuario de la base de datos (si los datos brindados son correctos)
   */
   delete: function(name, pass, callback) {
    users
      .destroy({where: {name, pass}})
      .then(result => {
        if(result) return callback(null, Boolean(result))
        else {
          return callback(new Error('Usuario o contrasenia incorrectos'))
        }
      })
      .catch(err => Boolean(err))
   },
  /**
   * Si el usuario y el password son correctos devuelve true
   */
  getByPass: function(name, pass, callback) {
    users
      .findOne({where: {name, pass}})
      .then(result => {
        if(result) {
          const data = result.dataValues
          return callback(null, data)
        }
        return callback(new Error('Usuario o contrasenia incorrecto'))
      })
      .catch(err => {
        return callback(new Error(err))
      })
  },
  get: function(id, callback) {
    users
      .findOne({where: {usuario: id}})
      .then(result => {
        if (result) {
          const data = result.dataValues
          return callback(null, {name: data.name, pass: data.pass, createdAt: data.created_at, updatedAt: data.updated_at})
        }
        else {
          return callback(new Error('Usuario incorrecto'))
        }
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
        fs.writeFile(path, JSON.stringify({pass:user.pass,blockeds:user.blockeds,silenced:user.silenced,friends:user.friends,friendRequests:user.friendRequests}), err => {
          if (err) return callback(err)
        })
      }
      else {
        user.silenced.push(idToSilence)
        fs.writeFile(path, JSON.stringify({pass:user.pass,blockeds:user.blockeds,silenced:user.silenced,friends:user.friends,friendRequests:user.friendRequests}), err => {
          if (err) return callback(err)
        })
      }
      return callback(null, user.silenced)
    })
  },
  getMuted: function(id, callback) {
    users
      .findOne({attributes: ['silenced'], where: {name: id}})
      .then(result => {
        const data = result.dataValues
        if (!data.silenced) {
          return callback(new Error('Usuario incorrecto'))
        }
        if (data.silenced) {
          return callback(null, data.silenced)
        }
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
        fs.writeFile(path, JSON.stringify({pass:user.pass,blockeds:user.blockeds,silenced:user.silenced,friends:user.friends,friendRequests:user.friendRequests}), err => {
          if (err) return callback(err)
        })
      }
      else {
        user.blockeds.push(idToBlock)
        fs.writeFile(path, JSON.stringify({pass:user.pass,blockeds:user.blockeds,silenced:user.silenced,friends:user.friends,friendRequests:user.friendRequests}), err => {
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
  isBlocked: function(id, comprobeId, callback) {
    this.getBlocked(id, (err, blockeds) => {
      if (err) {
        return callback(err)
      }
      const blocked = blockeds.some(blocked => blocked === comprobeId)
      if (blocked) {
        return callback(null, blocked)
      }
      else {
        this.getBlocked(comprobeId, (err, blockeds) => {
          if (err) {
            return callback(err)
          }
          callback(null, blockeds.some(blocked => blocked === id))
        })
      }
    })
  },
  isMuted: function(id, comprobeId, callback) {
    this.getMuted(id, (err, silenced) => {
      if (err) {
        return callback(err)
      }
      const silence = silenced.some(silence => silence === comprobeId)
      if (silence) {
        return callback(null, silence)
      }
      else {
        this.getMuted(comprobeId, (err, silenced) => {
          if (err) {
            return callback(err)
          }
          callback(null, silenced.some(silence => silence === id))
        })
      }
    })
  },
  addFriend: function(id, friendToAdd, callback) {
    this.areFriends(id, friendToAdd, (err, areFriends) => {
      if (err) return callback(err)
      if (areFriends) return callback(null, !areFriends)
      this.sendFriendRequest(friendToAdd, id, (err, sent) => {
        if (err) return callback(err)
        return callback(null, sent)
      })
    })
  },
  sendFriendRequest: function(id, friendRequested, callback) {
    this.get(id, (err, user) => {
      if (err) return callback(err)
      const found = user.friendRequests.some(request => request === friendRequested)
      if (!found) {
        user.friendRequests.push(friendRequested)
        const path = toPath(options.path, friendRequested)
        fs.writeFile(path, JSON.stringify({pass:user.pass,blockeds:user.blockeds,silenced:user.silenced,friends:user.friends,friendRequests:user.friendRequests}), err => {
          if (err) return callback(err)
          return callback(null, !found)
        })
      }
      return callback(null, found)
    })
  },
  areFriends: function(id, idToComprobe, callback) {
    this.get(id, (err, user) => {
      if (err) return callback(err)
      const found = user.friends.some(friend => friend === idToComprobe)
      if (found) return callback(null, found)
      else {
        this.get(idToComprobe, (err, user) => {
          if (err) return callback(err)
          const found = user.friends.some(friend => friend === id)
          return callback(null, found)
        })
      }
    })
  },
  acceptFriend: function(id, idToAccept, callback) {
    this.areFriends(id, idToAccept, (err, areFriends) => {
      if (err) return callback(err)
      if (areFriends) {
        return callback(null, !areFriends)
      }
      else {
        this.get(id, (err, user) => {
          if (err) return callback(err)
          const index = user.friendRequests.findIndex(request => request === idToAccept)
          user.friendRequests.splice(index, 1)
          user.friends.push(idToAccept)
          const path = toPath(options.path, id)
          fs.writeFile(path, JSON.stringify({pass:user.pass,blockeds:user.blockeds,silenced:user.silenced,friends:user.friends,friendRequests:user.friendRequests}), err => {
            if (err) return callback(err)
          })
          this.get(idToAccept, (err, user) => {
            if (err) return callback(err)
            const index = user.friendRequests.findIndex(request => request === id)
            user.friendRequests.splice(index, 1)
            user.friends.push(id)
            const path = toPath(options.path, idToAccept)
            fs.writeFile(path, JSON.stringify({pass:user.pass,blockeds:user.blockeds,silenced:user.silenced,friends:user.friends,friendRequests:user.friendRequests}), err => {
              if (err) return callback(err)
            })
            return callback(null, !areFriends)
          })
        })
      }
    })
  },
  deleteFriend: function(id, idToDelete, callback) {
    this.areFriends(id, idToDelete, (err, areFriends) => {
      if (err) return callback(err)
      if (areFriends) {
        this.get(id, (err, user) => {
          if (err) return callback(err)
          const index = user.friends.findIndex(friend => friend === idToDelete)
          user.friends.splice(index, 1)
          const path = toPath(options.path, id)
          fs.writeFile(path, JSON.stringify({pass:user.pass,blockeds:user.blockeds,silenced:user.silenced,friends:user.friends,friendRequests:user.friendRequests}), err => {
            if (err) return callback(err)
          })
          this.get(idToDelete, (err, user) => {
            if (err) return callback(err)
            const index = user.friends.findIndex(friend => friend === id)
            user.friends.splice(index, 1)
            const path = toPath(options.path, idToDelete)
            fs.writeFile(path, JSON.stringify({pass:user.pass,blockeds:user.blockeds,silenced:user.silenced,friends:user.friends,friendRequests:user.friendRequests}), err => {
              if (err) return callback(err)
            })
            return callback(null, areFriends)
          })
        })
      }
      else {
        return callback(null, areFriends)
      }
    })
  }
})
