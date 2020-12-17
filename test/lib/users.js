const config = require('../config')
const users = require('../../lib/users')(config)

describe('/lib/routes/users', () => {
//INICIO ADD
  describe('add method', () => {

    describe('When is a new user', () => {
      it('should return user obj', done => {
        users
          .add('nuevo', 'usuario', (err, user) => {
            expect(err).to.be.null
            expect(user).to.be.an('object')
            return done()
        })
      })
      after(done => users.delete('nuevo', 'usuario', done))
    })

    describe("When isn't a new user", () => {
      before(done => users.add('nuevo', 'usuario', done))
      it('Should throw on user name', done => {
        users.add('nuevo', 'asdas', (err, boolean) => {
          expect(err).to.match(/Nombre de usuario en uso/)
          expect(boolean).to.be.undefined
          return done()
        })
      })
      after(done => users.delete('nuevo', 'usuario', done))
    })

    describe('When user exists', () => {
      it('should throw error', (done) => {
        users.add('admin', 'pass', (err, user) => {
          expect(err).to.match(/Nombre de usuario en uso/)
          expect(user).to.be.undefined
          return done()
        })
      })
    })

  })
//FIN ADD
//INICIO DELETE
  describe('delete method', () => {

    describe('When user exists', () => {
      before(done => users.add('nuevo', 'usuario', done))
      it('Should return true', done => {
        users.delete('nuevo', 'usuario', (err, boolean) => {
          expect(err).to.be.null
          expect(boolean).to.be.true
          return done()
        })
      })
    })

    describe("When user doesn't exists", () => {
      it('Should return false', done => {
        users.delete('nuevo', 'usuario', (err, boolean) => {
          expect(err).to.match(/Usuario o contrasenia incorrectos/)
          expect(boolean).to.be.undefined
          return done()
        })
      })
    })

  })
//FIN DELETE
//INICIO GETBYPASS
  describe('getByPass method', () => {
    describe('when file doesn`t exists', () => {
      it('should throw error', (done) => {
        users.getByPass('id', 'pass', (err, user) => {
          expect(err).to.be.an('error')
          expect(user).to.be.undefined
          return done()
        })
      })
    })

    describe('when file exists', () => {
      it('should return an user', (done) => {
        users.getByPass('lucas', 'pass', (err, user) => {
          expect(err).to.be.null
          expect(user)
            .to.be.an('object')
            .to.have.property('pass')
              .to.be.a('string')
              .to.be.equal('pass')
          return done()
        })
      })
    })

    describe('when file exists but password is wrong', () => {
      it('should throw pass error', (done) => {
        users.getByPass('lucas', 'password', (err, user) => {
          expect(err).to.be.an('error')
          expect(user).to.be.undefined
          return done()
        })
      })
    })
  })

  describe('get method', () => {
    describe('when file doesn`t exists', () => {
      it('should throw error', (done) => {
        users.get('id', (err, user) => {
          expect(err).to.be.an('error')
          expect(user).to.be.undefined
          return done()
        })
      })
    })

    describe('when file exists', () => {
      it('should return an user', (done) => {
        users.get('lucas', (err, user) => {
          expect(err).to.be.null
          expect(user)
            .to.be.an('object')
            .to.have.property('pass')
              .to.be.a('string')
          return done()
        })
      })
    })
  })

  xdescribe('Silence method', () => {

    describe('when try to silence yourself', () => {
      it('should throw on invalid user', (done) => {
        users.mute('lucas', 'lucas', (err, blocked) => {
          expect(err)
            .to.be.an('error')
            .to.match(/No podes silenciarte a vos mismo/)
          expect(blocked)
            .to.be.undefined
          return done()
        })
      })
    })
    describe('when silence another user', () => {
      it('should mute that user', (done) => {
        users.mute('lucas', 'pepe', (err, muted) => {
          console.log(err)
          expect(err).to.be.null
          expect(muted)
            .to.be.an('array')
            .to.have.length(1)
            .to.have.members(['pepe'])
          return done()
        })
      })
      after(done => {
        users.mute('lucas', 'pepe', done)
      })
    })
    describe('when unmute an user', () => {
      before(done => {
        users.mute('lucas', 'pepe', done)
      })
      it('should unmute that user', (done) => {
        users.mute('lucas', 'pepe', (err, muted) => {
          expect(err).to.be.null
          expect(muted)
            .to.be.an('array')
            .to.have.length(0)
          return done()
        })
      })
    })

    describe('is muted?', () => {
      describe("When user is wrong", () => {
        it('Should throw on invalid user', done => {
          users.isMuted('lucas', 'jose', (err, boolean) => {
            expect(err).to.match(/Usuario invalido/)
            expect(boolean).to.be.undefined
            return done()
          })
        })
      })
      describe('When muted', () => {
        it('Should not be silenced', done => {
          users.isMuted('lucas', 'lcs', (err, boolean) => {
            expect(err).to.be.null
            expect(boolean).to.be.false
            return done()
          })
        })
      })
      describe('When not muted', () => {
        before(done => users.mute('lucas', 'lcs', done))
        it('Should be silenced', done => {
          users.isMuted('lucas', 'lcs', (err, boolean) => {
            expect(err).to.be.null
            expect(boolean).to.be.true
            return done()
          })
        })
        after(done => users.mute('lucas', 'lcs', done))
      })
    })

    describe("Getting muted users", () => {
      describe("When user is wrong", () => {
        it('Should throw on invalid user', done => {
          users.getMuted('jose', (err, mutedUsers) => {
            expect(err)
              .to.be.an('error')
              .to.match(/Usuario invalido/)
            expect(mutedUsers).to.be.undefined
            return done()
          })
        })
      })
      before(done => {
        users.mute('lucas', 'lcs', done)
      })
      it('should return muted users', done => {
        users.getMuted('lucas', (err, mutedUsers) => {
          expect(err).to.be.null
          expect(mutedUsers)
            .to.be.an('array')
            .to.have.length(1)
            .to.have.members(['lcs'])
          return done()
        })
      })
      after(done => users.mute('lucas','lcs',done))
    })
  })

  xdescribe('Block method', () => {

    describe('When try to block yourself', () => {
      it('should throw on invalid user', done => {
        users.block('lucas', 'lucas', (err, blocked) => {
          expect(err).to.match(/No podes bloquearte a vos mismo/)
          expect(blocked).to.be.undefined
          return done()
        })
      })
    })
    describe('When try to block another user', () => {
      it('should block that user', done => {
        users.block('lucas', 'jose', (err, blocked) => {
          expect(err).to.be.null
          expect(blocked)
            .to.be.an('array')
            .to.have.length(1)
            .to.have.members(['jose'])
          return done()
        })
      })
      after(done => {
        users.block('lucas', 'jose', done)
      })
    })

    describe('When try to unblock an user', () => {
      before(done => {
        users.block('lucas', 'jose', done)
      })
      it('should unblock that user', done => {
        users.block('lucas', 'jose', (err, blockeds) => {
          expect(blockeds)
            .to.be.an('array')
            .to.have.length(0)
          return done()
        })
      })
    })
    describe('Getting blocked users', () => {
      it('should throw on invalid user', (done) => {
        users.getBlocked('asda', (err, blockeds) => {
          expect(err).to.match(/Usuario invalido/)
          expect(blockeds).to.be.undefined
          return done()
        })
      })
      before(done => {
        users.block('lucas', 'jose', done)
      })
      it('Should return blockeds users', (done) => {
        users.getBlocked('lucas', (err, blockeds) => {
          expect(err).to.be.null
          expect(blockeds)
            .to.be.an('array')
            .to.have.length(1)
            .to.have.members(['jose'])
          return done()
        })
      })
      after(done => {
        users.block('lucas', 'jose', done)
      })
    })

    describe('is blocked?', () => {

      it('Should throw on invalid user', done => {
        users.isBlocked('lucas', 'jose', (err, boolean) => {
          expect(err).to.match(/Usuario invalido/)
          expect(boolean).to.be.undefined
          return done()
        })
      })
      it('Should throw on invalid user', done => {
        users.isBlocked('luc', 'jose', (err, boolean) => {
          expect(err).to.match(/Usuario invalido/)
          expect(boolean).to.be.undefined
          return done()
        })
      })

      it('Should not be blocked', done => {
        users.isBlocked('lucas', 'lcs', (err, boolean) => {
          expect(err).to.be.null
          expect(boolean).to.be.false
          return done()
        })
      })

      describe('When is blocked', () => {
        before(done => {
          users.block('lucas', 'lcs', done)
        })
        it('should be blocked', done => {
          users.isBlocked('lucas', 'lcs', (err, boolean) => {
            expect(err).to.be.null
            expect(boolean).to.be.true
            return done()
          })
        })
        after(done => {
          users.block('lucas', 'lcs', done)
        })
      })
    })
  })

  describe('Comprobing friends', () => {
    describe("When users doesn't exists", () => {
      it('should throw on invalid user', done => {
        users.areFriends('lucas', 'asd', (err, areFriends) => {
          expect(err).to.match(/usuario no existe/)
          expect(areFriends).to.be.undefined
          return done()
        })
      })
      it('should throw on invalid user', done => {
        users.areFriends('asd', 'lucas', (err, areFriends) => {
          expect(err).to.match(/usuario no existe/)
          expect(areFriends).to.be.undefined
          return done()
        })
      })
    })
    describe("When there aren't friends", () => {
      it('should return falsee', done => {
        users.areFriends('lucas', 'lcs', (err, areFriends) => {
          expect(err).to.be.null
          expect(areFriends).to.be.false
          return done()
        })
      })
      it('should return false', done => {
        users.areFriends('lcs', 'lucas', (err, areFriends) => {
          expect(err).to.be.null
          expect(areFriends).to.be.false
          return done()
        })
      })
    })
    describe("When there are friends", () => {
      it.only('Should return true', done => {
        users.areFriends('lucas', 'lcs', (err, areFriends) => {
          console.log(err)
          expect(err).to.be.null
          expect(areFriends).to.be.true
          return done()
        })
      })
      it('Should return true', done => {
        users.areFriends('lcs', 'lucas', (err, areFriends) => {
          expect(err).to.be.null
          expect(areFriends).to.be.true
          return done()
        })
      })
    })
  })
})
