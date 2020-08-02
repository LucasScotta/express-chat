const request = require('./request')

describe("when path is unknown", () => {
  it("should response a 404", (done) => {
    request()
      .get('/a')
      .expect(404)
      .end(done)
  })
})
