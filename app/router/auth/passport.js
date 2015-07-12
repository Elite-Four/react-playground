var config = require('config')

var passport = module.exports = require('passport')
var GitHubStrategy = require('passport-github').Strategy

passport.use(new GitHubStrategy(config.get('github'),
  function(accessToken, refreshToken, profile, done) {
    return done(null, { id: profile.id })
  }
))

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})
