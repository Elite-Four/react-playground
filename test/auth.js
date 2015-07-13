var url = require('url')

require('should')

describe('Authorization', function () {
  var request, port, server, dummyUser

  before(function (done) {
    request = require('./helpers/request')
    port = request.port
    dummyUser = require('./helpers/dummyUser')

    var app = require('../app')
    server = app.listen(port, done)
  })

  it('should be able to login and redirect to user page', function (done) {
    request.get('/', function (err, response, body) {
      if (err) return done(err)
      response.request.path.should.equal('/@' + dummyUser.username)
      done()
    })
  })

  after(function (done) {
    server.close(done)
  })
})
