require('should')

var async = require('async')

describe('Authorization', function () {
  var request = require('./helpers/request')
  var dummyUser = require('./helpers/dummyUser')

  it('should be able to login and redirect to user page', function (done) {
    async.waterfall([
      function (next) {
        request.get('/', next)
      },
      async.asyncify(function (response, body) {
        response.request.path.should.equal(dummyUser.user.toURL())
      })
    ], done)
  })
})
