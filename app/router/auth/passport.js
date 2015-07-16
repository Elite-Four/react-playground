var config = require('config')

var passport = module.exports = require('passport')
var GitHubStrategy = require('passport-github').Strategy

var User = require('../../models/User')

var auth = config.get('github')

passport.use('github', new GitHubStrategy({
    "clientID": auth.id,
    "clientSecret": auth.secret,
    "callbackURL": auth.callback
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, new User(profile.username))
    console.log('done')
  }
))

passport.serializeUser(function (user, done) {
  done(null, user.name)
})

passport.deserializeUser(function (name, done) {
  done(null, new User(name))
})
