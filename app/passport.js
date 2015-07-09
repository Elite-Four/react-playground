var path = require('path')
var fs = require('fs')
var passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy

passport.use(new GitHubStrategy({
    clientID: "9c98ad5b5491645379e9",
    clientSecret: "be962441969648d132ef0e7c10d5f1ecff44d669",
    callbackURL: "http://127.0.0.1:3000/login"
  },
  function(accessToken, refreshToken, profile, done) {
    var id = profile.id
    fs.mkdir(path.join(__dirname, '../codes', id.toString()),
      function (err) {
        if (err == null || err.code == 'EEXIST') {
          return done(null, { id: id })
        } else {
          return done(err)
        }
      })
  }
))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport