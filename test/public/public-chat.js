const request = require('../server/request')

describe('When path is chat.html', () => {
  describe('When logged', () => {
    const agent = request.agent()
    before((done) => {
      agent
        .post('/api/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user=lucas')
        .send('pass=pass')
        .expect(302)
        .expect('Content-Type', /text/)
        .end(done)
    })
    it('should response the chat', (done) => {
      agent
        .get('/chat.html')
        .expect(200, /chat/, /messages/, /send/, /message/)
        .end(done)
    })
  })

  describe('When not logged', () => {
    it.only('should response a 302 to the loggin form', (done) => {
      request()
        .get('/chat.html')
        .expect(302, /Redirecting to \/loggin/)
        .end(done)
    })
  })
})
