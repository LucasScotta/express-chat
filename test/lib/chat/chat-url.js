const request = require('../../server/request')
const util = require('../../server/util')

describe('/message', () => {
  describe("Creating room", () => {
    const agent = request.agent()
    before('log', done => {
      util.loggin(agent, done)
    })
    it("Should create a room", done => {
      agent
        .get('/chat/create')
        .expect(200, done)
    })
  })
  describe("When path is a get on /message", () => {

    describe("When not logged", () => {
      it('should response the loggin page', (done) => {
        request()
          .get('/chat/message')
          .query({ roomId:1 })
          .expect(200, /form.+loggin/)
          .end(done)
      })
    })

    describe("When logged", () => {
      describe("When not roomId", () => {
        const agent = request.agent()
        before('log', done => {
          util.loggin(agent, done)
        })
        it('Should response a 400', (done) => {
          agent
            .get('/chat/message')
            .expect(400, done)
        })
      })

      describe("When roomId", () => {
        const agent = request.agent()
        before('log', done => {
          agent
            .post('/loggin')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('user=lucas')
            .send('pass=pass')
            .expect(302, /Redirecting to \/.*/)
            .end(done)
        })
        it('should response a 200', (done) => {
          agent
            .get('/chat/message')
            .set('Content-Type', 'application/json')
            .query({ roomId:1 })
            .expect(200)
            .end(done)
        })
      })
    })
  })

  describe("When path is a post on '/message'", () => {
    describe("When not logged", () => {
      it('Should response the loggin page', (done) => {
        request()
          .post('/chat/message', { message:'hola', roomId:1 })
          .expect(200, /form.*loggin/)
          .end(done)
      })
    })

    describe("When logged", () => {
      describe("When not message", () => {
        const agent = request.agent()
        before('log', done => {
          agent
            .post('/loggin')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('user=lucas')
            .send('pass=pass')
            .expect(302, /Redirecting to \/.*/)
            .end(done)
        })
        it('Should response a 200', (done) => {
          agent
            .post('/chat/message')
            .set('Content-Type', 'application/json')
            .send({roomId:1})
            .expect(200, done)
        })
      })

      describe("When not roomId", () => {
        const agent = request.agent()
        before('log', done => {
          agent
            .post('/loggin')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('user=lucas')
            .send('pass=pass')
            .expect(302, /Redirecting to \/.*/)
            .end(done)
        })
        it('Should response a 400', done => {
          agent
            .post('/chat/message')
            .set('Content-Type', 'application/json')
            .send({message:'hola'})
            .expect(400, done)
        })
      })

      describe("When bad roomId", () => {
        const agent = request.agent()
        before('log', done => {
          util.loggin(agent, done)
        })
        it('should response a 400', done => {
          agent
            .post('/chat/message')
            .set('Content-Type', 'application/json')
            .send({message:'hola'})
            .send({roomId:123})
            .expect(400, done)
        })
      })

      describe("When message and roomId", () => {
        const agent = request.agent()
        before('log', done => {
          agent
            .post('/loggin')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send('user=lucas')
            .send('pass=pass')
            .expect(302, /Redirecting to \/.*/)
            .end(done)
        })
        it('Should response a 200', done => {
          agent
            .post('/chat/message')
            .set('Content-Type', 'application/json')
            .send({message:'hola'})
            .send({roomId:1 })
            .expect(200, done)
        })
      })
    })
  })
})
