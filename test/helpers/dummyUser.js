var dummyId = 21
var dummyUsername = 'Soul'

// Mock getUserId

var github = require('../../app/models/User/github')

github.getUserId = function (user, callback) {
  if (user == dummyUsername)
    return setImmediate(callback, null, dummyId)
  else
    return setImmediate(callback, new Error('Invalid user'))
}

// Mock passport

var passport = require('../../app/router/auth/passport')
var DummyStrategy = require('passport-dummy').Strategy

var User = require('../../app/models/User')
var dummyUser = new User(dummyUsername)

var dummyStrategy = new DummyStrategy(function (done) {
  done(null, dummyUser)
})

passport.use('github', dummyStrategy)

exports.id = dummyId
exports.username = dummyUsername
exports.user = dummyUser
