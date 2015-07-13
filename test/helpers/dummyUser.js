var DummyStrategy = require('passport-dummy').Strategy

var passport = require('../../app/router/auth/passport')
var github = require('../../app/router/user/github')

var dummyId = 21
var dummyUsername = 'Soul'

// Mock passport

var dummyStrategy = new DummyStrategy(function (done) {
  done(null, {
    id: dummyId,
    username: dummyUsername
  })
})

passport.use('github', dummyStrategy)

// Mock getUserId

github.getUserId = function (user, callback) {
  if (user == dummyUsername)
    return setImmediate(callback, null, dummyId)
  else
    return setImmediate(callback, new Error('Invalid user'))
}

exports.id = dummyId
exports.username = dummyUsername
