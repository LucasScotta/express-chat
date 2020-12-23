const users = require('./psql/users')
const silences = require('./psql/silences')
const blocks = require('./psql/blocks')
const friendRequests = require('./psql/friend-requests')
const friends = require('./psql/friends')
const Op = require('sequelize').Op
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
      .catch(err => callback(err))
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
      .catch(err => callback(err))
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
      .findOne({where: {name: id}})
      .then(result => {
        if (result) {
          const data = result.dataValues
          return callback(null, data)
        }
        else {
          return callback(new Error('Usuario incorrecto'))
        }
      })
  },
  mute: function(id, idToSilence, callback) {
    if(id === idToSilence) return callback(new Error('No podes mutearte a vos mismo, genio'))
    this.get(id, (err, user1) => {
      if(err || !user1) callback(err)
      else {
        this.get(idToSilence, (err, user2) => {
          if (err || !user2) callback(err)
          else {
            const id1 = user1.id
            const id2 = user2.id
            silences
              .create({id: id1, silence: id2})
              .then(result => callback(null, Boolean(result)))
              .catch(() => callback(new Error('Este usuario ya se encuentra silenciado')))
          }
        })
      }
    })
  },
  unmute: function(id, idToUnmute, callback) {
    if (id === idToUnmute) return callback(new Error('No podrias haber llegado hasta aca'))
    this.get(id, (err, user1) => {
      if(err) callback(err)
      else {
        this.get(idToUnmute, (err, user2) => {
          if(err) callback(err)
          else {
            const id1 = user1.id
            const id2 = user2.id
            silences
              .destroy({
                where: {
                  id: id1, silence: id2
                }
              })
              .then(result => callback(null, Boolean(result)))
              .catch(err => callback(err))
          }
        })
      }
    })
  },
  getMuted: function(name, callback) {
    const ids = []
    const names = []
    this.get(name, (err, user) => {
      if (err) return callback(err)
      silences
        .findAll({
          attributes: ['silence'],
          where: {
            id: user.id
          }
        })
        .then(results => {
          for (const result of results) {
            const data = result.dataValues
            ids.push(data.silence)
          }
          users
            .findAll({
              attributes: ['name'],
              where: {id: ids}
            })
            .then(results => {
              for (const result of results) {
                const data = result.dataValues
                names.push(data.name)
              }
              return callback(null, names)
            })
            .catch(err => callback(err))
        })
        .catch(err => callback(err))
    })
  },
  block: function(id, idToBlock, callback) {
    if(id === idToBlock) return callback(new Error('No podes bloquearte a vos mismo, genio'))
    this.get(id, (err, user1) => {
      if (err) return callback(err)
      else {
        this.get(idToBlock, (err, user2) => {
          if (err) return callback(err)
          else {
            this.deleteFriend(id, idToBlock, () => {})
            this.cancelFriendRequest(id, idToBlock, () => {})
            this.declineFriendRequest(id, idToBlock, () => {})
            const id1 = user1.id
            const id2 = user2.id
            blocks
              .create({id:id1, block:id2})
              .then(result => callback(null, Boolean(result)))
              .catch(() => callback(new Error('Este usuario ya se encuentra bloqueado')))
          }
        })
      }
    })
  },
  unblock: function(id, idToUnblock, callback) {
    if(id === idToUnblock) return callback(new Error('No podes desbloquearte a vos mismo, genio'))
    this.get(id, (err, user1) => {
      if(err) return callback(err)
      else {
        this.get(idToUnblock, (err, user2) => {
          if(err) return callback(err)
          else {
            const id1 = user1.id
            const id2 = user2.id
            blocks
              .destroy({
                where: {
                  id:id1, block:id2
                }
              })
              .then(result => callback(null, Boolean(result)))
              .catch(err => callback(err))
          }
        })
      }
    })
  },
  getBlocked: function(name, callback) {
    const ids = []
    const names = []
    this.get(name, (err, user) => {
      if (err) return callback(err)
      blocks
        .findAll({
          attributes: ['block'],
          where: {
            id: user.id
          }
        })
        .then(results => {
          for (const result of results) {
            const data = result.dataValues
            ids.push(data.block)
          }
          users
            .findAll({
              attributes: ['name'],
              where: {id: ids}
            })
            .then(results => {
              for (const result of results) {
                const data = result.dataValues
                names.push(data.name)
              }
              return callback(null, names)
            })
            .catch(err => callback(err))
        })
        .catch(err => callback(err))
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
    if (id === comprobeId) return callback(new Error('Imposible'))
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
  sendFriendRequest: function(id, friendRequested, callback) {
    if(id === friendRequested) return callback('No podes agregarte a vos mismo a amigos, genio')
    this.get(id, (err, user1) => {
      if(err) return callback(err)
      else {
        this.get(friendRequested, (err, user2) => {
          if (err) return callback(err)
          else {
            this.areFriends(id, friendRequested, (err, areFriends) => {
              if (areFriends) return callback(null, !areFriends)
              else {
                const id1 = user1.id
                const id2 = user2.id
                friendRequests
                  .create({id: id1, request: id2})
                  .then(result => {
                    if(result) {
                      callback(null, Boolean(result))
                    }
                  })
                  .catch(() => {
                    callback(new Error('Ya has enviado una solicitud a este usuario'))
                  })
              }
            })
          }
        })
      }
    })
  },
  getFriendRequestsSent: function(name, callback) {
    const ids = []
    const names = []
    this.get(name, (err, user) => {
      if (err) return callback(err)
      else {
        friendRequests
          .findAll({
            attributes: ['request'],
            where: {
              id: user.id
            }
          })
          .then(results => {
            for (const result of results) {
              const data = result.dataValues
              ids.push(data.request)
            }
            users
              .findAll({
                attributes: ['name'],
                where: {id: ids}
              })
              .then(results => {
                for (const result of results) {
                  const data = result.dataValues
                  names.push(data.name)
                }
                return callback(null, names)
              })
              .catch(err => callback(err))
          })
          .catch(err => callback(err))
      }
    })
  },
  getFriendRequestsRecieved: function(name, callback) {
    const ids = []
    const names = []
    this.get(name, (err, user) => {
      if (err) return callback(err)
      else {
        friendRequests
          .findAll({
            attributes: ['id'],
            where: {
              request: user.id
            }
          })
          .then(results => {
            for (const result of results) {
              const data = result.dataValues
              ids.push(data.id)
            }
            users
              .findAll({
                attributes: ['name'],
                where: {id: ids}
              })
              .then(results => {
                for (const result of results) {
                  const data = result.dataValues
                  names.push(data.name)
                }
                return callback(null, names)
              })
              .catch(err => callback(err))
          })
          .catch(err => callback(err))
      }
    })
  },
  cancelFriendRequest: function(name, requestToCancel, callback) {
    if (name === requestToCancel) return callback(new Error('No podrias haber llegado hasta aca'))
    this.get(name, (err, user1) => {
      if (err) return callback(err)
      else {
        this.get(requestToCancel, (err, user2) => {
          if (err) return callback(err)
          else {
            const id1 = user1.id
            const id2 = user2.id
            friendRequests
              .destroy({
                where: {
                  id: id1, request: id2
                }
              })
              .then(result => callback(null, Boolean(result)))
              .catch(err => callback(err))
          }
        })
      }
    })
  },
  declineFriendRequest: function(name, requestToDecline, callback) {
    if (name === requestToDecline) return callback(new Error('No podrias haber llegado hasta aca'))
    this.get(name, (err, user1) => {
      if (err) return callback(err)
      else {
        this.get(requestToDecline, (err, user2) => {
          if (err) return callback(err)
          else {
            const id1 = user1.id
            const id2 = user2.id
            friendRequests
              .destroy({
                where: {
                  id: id2, request: id1
                }
              })
              .then(result => callback(null, Boolean(result)))
              .catch(err => callback(err))
          }
        })
      }
    })
  },
  acceptFriendRequest: function(name, idToAccept, callback) {
    if (name === idToAccept) return callback(new Error('No podes aceptarte a vos mismo'))
    this.get(name, (err, user1) => {
      if (err) return callback(err)
      else {
        this.get(idToAccept, (err, user2) => {
          if (err) callback(err)
          else {
            const id1 = user1.id
            const id2 = user2.id
            friendRequests
              .destroy({
                where: {
                  id: id2, request: id1
                }
              })
              .then(result => {
                if (result) {
                  friends
                    .create({user1: user1.name, user2: user2.name})
                    .then(result => callback(null, Boolean(result)))
                    .catch(err => callback(err))
                }
                else {
                  return callback(null, Boolean(result))
                }
              })
              .catch(err => callback(err))
          }
        })
      }
    })
  },
  areFriends: function(name, nameToComprobe, callback) {
    if (name === nameToComprobe) return callback(new Error('Si, claro que si'))
      this.get(name, (err, user1) => {
        if (err) return callback(err)
        else {
          this.get(nameToComprobe, (err, user2) => {
            if (err) return callback(err)
            else {
              const ids = [user1.name, user2.name]
              friends
                .findOne({
                  where: {
                    user1: ids, user2: ids
                  }
                })
                .then(result => callback(null, Boolean(result)))
                .catch(err => callback(err))
            }
          })
        }
      })
  },
  deleteFriend: function(name, nameToDelete, callback) {
    if(name === nameToDelete) return callback(new Error('No podes eliminarte a vos mismo'))
    this.get(name, (err, user1) => {
      if (err) return callback(err)
      else {
        this.get(nameToDelete, (err, user2) => {
          if (err) return callback(err)
          else {
            const names = [user1.name, user2.name]
            friends
              .destroy({
                where: {
                  user1: names, user2: names
                }
              })
              .then(result => callback(null, Boolean(result)))
              .catch(err => callback(err))
          }
        })
      }
    })
  },
  getFriends: function(name, callback) {
    this.get(name, (err, user) => {
      if (err) return callback(err)
      else {
        friends
          .findAll({
            where: {
              [Op.or]: [{user1: user.name}, {user2: user.name}]
            }
          })
          .then(results => {
            const names = []
            for (const result of results) {
              const data = result.dataValues
              if(data.user1 != name) {
                names.push(data.user1)
              }
              else {
                names.push(data.user2)
              }
            }
            callback(null, names)
          })
          .catch(err => callback(err))
      }
    })
  },
})
