const request = require('../server/request')

describe("when path is '/api'", () => {
  it("should response a 404", (done) => {
    request()
      .get('/api')
      .expect(404)
      .end(done)
  })
})
