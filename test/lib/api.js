const request = require('../server/request')

describe("when path is '/api'", () => {
  it("should response the home page", (done) => {
    request()
      .get('/api')
      .expect(200, /Home/, /Welcome/)
      .end(done)
  })
})
