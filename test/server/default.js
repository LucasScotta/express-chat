const request = require('./request')

describe("when path is '/'", () => {
  it("should response the home page", (done) => {
    request()
      .get('/')
      .expect(200, /Home/, /Bienvenido/)
      .end(done)
  })
})
