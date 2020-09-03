const request = require('../../server/request')

describe("Should found the bug for me", () => {
  const agent1 = request.agent
  const agent2 = request.agent
  before((done) => {
    agent1
        .post('/api/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user=lucas')
        .send('pass=pass')
        .expect(302, /Redirecting to \//)
        .end(done)
    agent2
        .post('/api/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send('user=lucas')
        .send('pass=pass')
        .expect(302, /Redirecting to \//)
        .end(done)
  })
})
