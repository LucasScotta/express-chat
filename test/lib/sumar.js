const request = require('../server/request')

describe("/sumar", () => {
  describe("When there's number", () => {
    it('Should response the number + 1', done => {
      request()
        .post('/sumar')
        .set('Content-type', 'application/json')
        .send({ number:1 })
        .expect(200, /2/)
        .end(done)
    })
  })

  describe("When there isn't color", () => {
    it("Should response a 417", done => {
      request()
        .post('/sumar')
        .expect(417, done)
    })
  })
})
