const request = require('./request')

describe("when path is '/'", () => {
  it("should send 'Bienvenido'", (done) => {
    request()
      .get('/')
      .expect('Bienvenido')
      .expect(200)
      .end(done)
  })
})
