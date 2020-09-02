const request = require('./request')

describe("when path is unknown", () => {
  it("should response the home page '/'", (done) => {
    request()
      .get('/a')
      .expect(200, /Home/, '/Welcome/')
      .end(done)
  })
})
