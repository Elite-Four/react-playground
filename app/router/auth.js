var cookieSession = require('cookie-session')
var passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy

var config = require('./auth.json')

var router = require('./')

passport.use(new GitHubStrategy(config,
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

router.use(cookieSession({
  secret: 'hello react playground blah'
}))

router.use(passport.initialize())
router.use(passport.session())

router.get('/auth/login',
  passport.authenticate('github'),
  function (req, res) {
    res.redirect('/')
  })

router.get('/auth/logout',
  function (req, res) {
    req.session = null
    res.redirect('/')
  })
