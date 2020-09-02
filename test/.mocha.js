const chai = require('chai')

chai.use(require('chai-spies'))

global.chai = chai
global.assert = chai.assert
global.expect = chai.expect
