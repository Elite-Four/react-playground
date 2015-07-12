var config = require('config')

var passport = module.exports = require('passport')
var GitHubStrategy = require('passport-github').Strategy

passport.use(new GitHubStrategy(config.get('github'),
  function(accessToken, refreshToken, profile, done) {
    return done(null, { id: profile.id })
  }
))

function doneSelf(self, done) {
  done(null, self)
}

passport.serializeUser(doneSelf)
passport.deserializeUser(doneSelf)
