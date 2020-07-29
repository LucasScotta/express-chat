const config = {
	path: __dirname + '/../datos/users',
}
const users = require('../../lib/users')(config)
const fs = require('fs')
// const assert = (es_correcto, msg) => {
// 	if (!es_correcto) throw Error(msg || 'Expectation failed')
// }
// const assert_typeof = (obj, type, msg) => {
// 	assert(typeof obj === type, `Expected ${type}, but got ${typeof obj}. ${msg || ''}`)
// }
// assert.typeOf(users, 'boolean')

describe('/lib/routes/users', () => {
	const unlink = (path, next) => {
		fs.unlink(path, (err) => {
			if(err && err.code !== 'ENOENT') next(err)
			else next()
		})
	}
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
					done()
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
					done()
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
					done()
				})
			})
		})
	})
})