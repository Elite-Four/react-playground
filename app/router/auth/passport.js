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
    return done(null, new User(profile.username))
  }
))

function doneSelf(self, done) {
  done(null, self)
}

passport.serializeUser(doneSelf)
passport.deserializeUser(doneSelf)
