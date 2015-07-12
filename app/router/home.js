var router = require('./')

require('./auth')

router.get('/', function (req, res) {
  res.type('html')
  if (req.user) {
    res.end('Logged in:<pre>' + JSON.stringify(req.user) + '</pre> <a href="/auth/logout">Logout</a>')
  } else {
    res.end('<a href="/auth/login">Login</a>')
  }
})
