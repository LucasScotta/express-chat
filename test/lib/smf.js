const request = require('../server/request')

describe('/smf', () => {
  describe('post', () => {

    describe('When not color', () => {
      it('should response a 400', done => {
        request()
          .post('/smf')
          .expect(400, done)
      })
    })

    describe("When color", () => {

      describe("When new color", () => {
        it('Should response a 200', done => {
          request()
            .post('/smf')
            .set('Content-type', 'application/json')
            .send({ color:'blue' })
            .expect(200, done)
        })
      })

      describe("When repeat a color", () => {
        const agent = request.agent()
        before('Should change the color', done => {
          agent
            .post('/smf')
            .set('Content-type', 'application/json')
            .send({ color:'blue' })
            .expect(200, done)
        })
        it('Should respnse a 200', done => {
          agent
            .post('/smf')
            .set('Content-type', 'application/json')
            .send({ color:'blue' })
            .expect(200, done)
        })
      })
    })
  })

  describe('get', () => {
    describe('When change color', () => {
      const agent = request.agent()
      before(done => {
        agent
          .post('/smf')
          .set('Content-type', 'application/json')
          .send({ color:'blue' })
          .expect(200, done)
      })
      it('should response the color', done => {
        agent
          .get('/smf')
          .set('Content-type', 'application/json')
          .query({ color:'red' })
          .expect(200, /blue/)
          .end(done)
      })
    })

    describe("When not color", () => {
      it("Should response blue", done => {
        request()
          .get('/smf')
          .expect(200, /blue/)
          .end(done)
      })
    })

    describe("When color is undefined", () => {
      it("Should response blue", done => {
        request()
          .get('/smf')
          .set('Content-type', 'application/json')
          .send({ color: undefined })
          .expect(200, /blue/)
          .end(done)
      })
    })
  })
})
