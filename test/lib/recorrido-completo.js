const request = require('../server/request')
const util = require('../server/util')

describe("Should found the bug for me", () => {
  const agent1 = request.agent
  const agent2 = request.agent
  before((done) => {
    util.loggin(agent1, done)
    util.loggin2(agent2, done)
  })
})
