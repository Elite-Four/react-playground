var cookieSession = require('cookie-session')

var passport = require('./passport')

var router = require('../')

router.use(cookieSession({
  secret: 'hello react playground blah'
}))

router.use(passport.initialize())
router.use(passport.session())

router.get('/auth/login',
  passport.authenticate('github'),
  function (req, res) {
    if (req.user) {
      res.redirect('/@' + req.user.username)
    } else {
      res.redirect('/')
    }
  })

router.get('/auth/logout',
  function (req, res) {
    req.logout()
    res.redirect('/')
  })
