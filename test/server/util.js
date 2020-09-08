module.exports = {
  loggin: (agent, done) => {
    agent
      .post('/loggin')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('user=lucas')
      .send('pass=pass')
      .expect(302, /Redirecting to \/.*/)
      .end(done)
  },
  loggin2: (agent, done) => {
    agent
      .post('/loggin')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('user=lcs')
      .send('pass=pass')
      .expect(302, /Redirecting to \//)
      .end(done)
  }
}
