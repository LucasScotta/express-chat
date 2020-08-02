process.env.DATA_DIR = __dirname + '/../datos/users'
const app = require('../../app')
const supertest = require('supertest')

module.exports = () => {
  return supertest(app)
}
