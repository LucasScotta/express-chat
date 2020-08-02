const request = require('./request')

describe("when path is '/ping'", () => {
  it("should send 'pong'", (done) => {
    request()
      .get('/ping')
      .expect('pong')
      .expect(200)
      .end(done)
  })
})
