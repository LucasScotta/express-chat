const request = require('../server/request')

describe('When path is chat', () => {
  describe('When logged', () => {
    const agent = request.agent()
    before((done) => {
      agent
        .post('/loggin')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user=lucas')
        .send('pass=pass')
        .expect(302)
        .expect('Content-Type', /text/)
        .end(done)
    })
    it('should response 200 and chat', (done) => {
      agent
        .get('/chat')
        .expect(200, /chat/, /messages/, /send/, /message/)
        .end(done)
    })
  })

  describe('When not logged', () => {
    it('should response a 200 to the loggin form', (done) => {
      request()
        .get('/chat')
        .expect(200, /form/, /user/, /pass/)
        .end(done)
    })
  })
})
