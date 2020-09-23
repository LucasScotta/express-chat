const config = require('../config')
const users = require('../../lib/users')(config)
const unlink = require('./unlink')

describe('/lib/routes/users', () => {

  describe('add method', () => {
    describe('when file doesn`t exists', () => {
      before((done) => {
        unlink(config.path + '/id.json', done)
      })
      it('should create a new user', (done) => {
        users.add('id', 'pass', (err, user) => {
          expect(err).to.be.null
          expect(user)
            .to.be.an('object')
            .to.have.property('pass')
              .to.be.a('string')
          return done()
        })
      })
      after((done) => {
        unlink(config.path + '/id.json', done)
      })
    })

    describe('when file exists', () => {
      it('should throw error', (done) => {
        users.add('lucas', 'pass', (err, user) => {
          expect(err).to.be.an('error')
          expect(user).to.be.undefined
          return done()
        })
      })
    })
  })

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

  describe('Silence method', () => {

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
      it.only('should return the muted users', done => {
        users.getMuted('lucas', (err, mutedUsers) => {
          expect(err).to.be.null
          expect(mutedUsers)
            .to.be.an('array')
            .to.have.length(0)
          return done()
        })
      })
    })
  })
})
