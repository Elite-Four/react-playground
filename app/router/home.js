var router = require('./')

require('./auth')

router.get('/', function (req, res) {
  res.redirect('/auth/login')
})
