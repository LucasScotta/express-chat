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

    describe('when user doesn`t exists', () => {
      it('should throw error', (done) => {
        users.getByPass('id', 'pass', (err, user) => {
          expect(err).to.match(/Usuario o contrasenia incorrectos/)
          expect(user).to.be.undefined
          return done()
        })
      })
    })

    describe('when user exists', () => {
      it('should return an user', (done) => {
        users.getByPass('lucas', 'A', (err, user) => {
          expect(err).to.be.null
          expect(user)
            .to.be.an('object')
            .to.have.property('pass')
              .to.be.a('string')
              .to.be.equal('A')
          return done()
        })
      })
    })

    describe('when user exists but password is wrong', () => {
      it('should throw password error', (done) => {
        users.getByPass('lucas', 'password', (err, user) => {
          expect(err).to.match(/Usuario o contrasenia incorrectos/)
          expect(user).to.be.undefined
          return done()
        })
      })
    })

  })
//FIN GETBYPASS
//INICIO GET
  describe('get method', () => {

    describe('when user doesn`t exists', () => {
      it('should throw error', (done) => {
        users.get('id', (err, user) => {
          expect(err).to.match(/Usuario incorrecto/)
          expect(user).to.be.undefined
          return done()
        })
      })
    })

    describe('when user exists', () => {
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
//FIN GET
//INICIO SILENCE
  describe('Silence method', () => {

    describe('When an user silences other', () => {

      describe('When is not silenced', () => {
        it('Should return true', done => {
          users.mute('lucas', 'admin', (err, boolean) => {
            expect(err).to.be.null
            expect(boolean).to.be.true
            return done()
          })
        })
        after(done => users.unmute('lucas', 'admin', done))
      })

      describe('When is silenced', () => {
        before(done => users.mute('lucas', 'admin', done))
        it('should return false', done => {
          users.mute('lucas', 'admin', (err, boolean) => {
            expect(err).to.match(/Este usuario ya se encuentra silenciado/)
            expect(boolean).to.be.undefined
            return done()
          })
        })
        after(done => users.unmute('lucas', 'admin', done))
      })

      describe("When an user try to mute himself", () => {
        it('Should throw on dumbass err', done => {
          users.mute('lucas', 'lucas', (err, boolean) => {
            expect(err).to.match(/No podes mutearte a vos mismo, genio/)
            expect(boolean).to.be.undefined
            return done()
          })
        })
      })

      describe("When an user doesn't exists", () => {
        it('Should throw error on user', done => {
          users.mute('luqas', 'admin', (err, boolean) => {
            expect(err).to.match(/Usuario incorrecto/)
            expect(boolean).to.be.undefined
            return done()
          })
        })

        it('Should throw error on user', done => {
          users.mute('admin', 'luqas', (err, boolean) => {
            expect(err).to.match(/Usuario incorrecto/)
            expect(boolean).to.be.undefined
            return done()
          })
        })

        it('Should throw error on user', done => {
          users.mute('admi', 'luqas', (err, boolean) => {
            expect(err).to.match(/Usuario incorrecto/)
            expect(boolean).to.be.undefined
            return done()
          })
        })
      })

    })
    describe('Getting mutted users', () => {

      describe('When user exists', () => {
        before(done => {
          users.mute('lucas', 'admin', () => {
            users.mute('lucas', 'lcs', done)
          })
        })
        it('Should return the muted list', done => {
          users.getMuted('lucas', (err, list) => {
            expect(err).to.be.null
            expect(list).to.be.an('array')
              .to.have.length(2)
            return done()
          })
        })
        after(done => {
          users.unmute('lucas', 'admin', () => {
            users.unmute('lucas', 'lcs', done)
          })
        })
      })

      describe("When user doesn't exists", () => {
        it('Should throw on user', done => {
          users.getMuted('asda', (err, list) => {
            expect(err).to.match(/Usuario incorrecto/)
            expect(list).to.be.undefined
            return done()
          })
        })
      })

    })
  })
  describe('Unmutting users', () => {

    describe("When an user doesn't exists", () => {

      it('Should throw on invalid user', done => {
        users.unmute('asd', 'lucas', (err, boolean) => {
          expect(err).to.match(/Usuario incorrecto/)
          expect(boolean).to.be.undefined
          return done()
        })
      })

      it('Should throw on invalid user', done => {
        users.unmute('lucas', 'asd', (err, boolean) => {
          expect(err).to.match(/Usuario incorrecto/)
          expect(boolean).to.be.undefined
          return done()
        })
      })

    })

    describe("When users exist", () => {

      describe("When isn't mutted", () => {
        it('Should return false', done => {
          users.unmute('lucas', 'admin', (err, boolean) => {
            expect(err).to.be.null
            expect(boolean).to.be.false
            return done()
          })
        })
      })

      describe("When is mutted", () => {
        before(done => users.mute('lucas', 'admin', done))
        it('Should return true', done => {
          users.unmute('lucas', 'admin', (err, boolean) => {
            expect(err).to.be.null
            expect(boolean).to.be.true
            return done()
          })
        })
      })

    })

  })
//FIN SILENCE
//INICIO BLOCK
  describe('Block method', () => {

    describe('When an user blocks other', () => {

      describe("When isn't blocked", () => {
        it('Should return true', done => {
          users.block('lucas', 'admin', (err, boolean) => {
            expect(err).to.be.null
            expect(boolean).to.be.true
            return done()
          })
        })
        after(done => users.unblock('lucas', 'admin', done))
      })

      describe("When is blocked", () => {
        before(done => users.block('lucas', 'admin', done))
        it('Should throw on already blocked user', done => {
          users.block('lucas', 'admin', (err, boolean) => {
            expect(err).to.match(/Este usuario ya se encuentra bloqueado/)
            expect(boolean).to.be.undefined
            return done()
          })
        })
        after(done => users.unblock('lucas', 'admin', done))
      })

      describe("When an user doesn't exists", () => {
        it('Should throw on invalid user', done => {
          users.block('lucas', 'asd', (err, boolean) => {
            expect(err).to.match(/Usuario incorrecto/)
            expect(boolean).to.be.undefined
            return done()
          })
        })

        it('Should throw on invalid user', done => {
          users.block('asda', 'lucas', (err, boolean) => {
            expect(err).to.match(/Usuario incorrecto/)
            expect(boolean).to.be.undefined
            return done()
          })
        })
      })

      describe("When try to block himself", () => {
        it('Should throw on wrong method', done => {
          users.block('lucas', 'lucas', (err, boolean) => {
            expect(err).to.match(/No podes bloquearte a vos mismo, genio/)
            expect(boolean).to.be.undefined
            return done()
          })
        })
      })

    })

    describe('Unblocking users', () => {

      describe("When an user doesn't exists", () => {

        it('Should throw on user', done => {
          users.unblock('lucas', 'asd', (err, boolean) => {
            expect(err).to.match(/Usuario incorrecto/)
            expect(boolean).to.be.undefined
            return done()
          })
        })

        it('Should throw on user', done => {
          users.unblock('asd', 'lucas', (err, boolean) => {
            expect(err).to.match(/Usuario incorrecto/)
            expect(boolean).to.be.undefined
            return done()
          })
        })

      })

      describe('When users exists', () => {

        describe("When isn't blocked", () => {

          it('Should return false', done => {
            users.unblock('lucas', 'admin', (err, boolean) => {
              expect(err).to.be.null
              expect(boolean).to.be.false
              return done()
            })
          })

        })

        describe('When is blocked', () => {

          before(done => users.block('lucas', 'admin', done))
          it('Should return true', done => {
            users.unblock('lucas', 'admin', (err, boolean) => {
              expect(err).to.be.null
              expect(boolean).to.be.true
              return done()
            })
          })
        })


      })

    })

  })
//FIN BLOCK
//COMPROBANDO MUTEDS
  describe('Comprobing mutted', () => {

    describe("When an user doesn't exists", () => {

      it('Should throw on user', done => {
        users.isMuted('lucas', 'lc', (err, boolean) => {
          expect(err).to.match(/Usuario incorrecto/)
          expect(boolean).to.be.undefined
          return done()
        })
      })

      it('Should throw on user', done => {
        users.isMuted('lc', 'lucas', (err, boolean) => {
          expect(err).to.match(/Usuario incorrecto/)
          expect(boolean).to.be.undefined
          return done()
        })
      })

    })

    describe('When users exist', () => {

      describe('When is muted', () => {

        before(done => users.mute('lucas', 'admin', done))
        it('Should return true', done => {
          users.isMuted('lucas', 'admin', (err, boolean) => {
            expect(err).to.be.null
            expect(boolean).to.be.true
            return done()
          })
        })
        after(done => users.unmute('lucas', 'admin', done))

      })

      describe("When isn't muted", () => {

        it('Should return false', done => {
          users.isMuted('lucas', 'admin', (err, boolean) => {
            expect(err).to.be.null
            expect(boolean).to.be.false
            return done()
          })
        })
      })

    })

  })
//FIN MUTEDS
//COMPROBANDO BLOCKEDS
  describe('Getting blocked users', () => {

    describe("When user doesn't exists", () => {

      it('Should throw on user', done => {
        users.getBlocked('asdas', (err, list) => {
          expect(err).to.match(/Usuario incorrecto/)
          expect(list).to.be.undefined
          return done()
        })
      })

    })

    describe('When user exists', () => {
      before(done => users.block('lucas', 'admin', () => users.block('lucas', 'lcs', done)))
      it('Should return blocked users', done => {
        users.getBlocked('lucas', (err, list) => {
          expect(err).to.be.null
          expect(list).to.be.an('array')
            .to.have.length(2)
          return done()
        })
      })
      after(done => users.unblock('lucas', 'admin', () => users.unblock('lucas', 'lcs', done)))
    })

  })
//FIN BLOCKEDS
})
