require('should')

describe('Authorization', function () {
  var request = require('./helpers/request')
  var dummyUser = require('./helpers/dummyUser')

  it('should be able to login and redirect to user page', function (done) {
    request.get('/', function (err, response, body) {
      if (err) return done(err)
      response.request.path.should.equal('/@' + dummyUser.username)
      done()
    })
  })
})
