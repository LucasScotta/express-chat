module.exports = {
  loggin: (agent, done) => {
    agent
      .post('/loggin')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('user=lucas')
      .send('pass=A')
      .expect(302, /Redirecting to \/.*/)
      .end(done)
  },
  loggin2: (agent, done) => {
    agent
      .post('/loggin')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('user=lcs')
      .send('pass=A')
      .expect(302, /Redirecting to \//)
      .end(done)
  }
}
