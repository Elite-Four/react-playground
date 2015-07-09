var passport = require('../passport')

module.exports = function (app) {
  app.get('/', require('./home'))

  void function (auth) {
    app.get('/login', passport.authenticate('github'), auth.login)
    app.get('/logout', auth.logout)
  } (require('./auth'))
  
  void function (code) {
    app.param('user', code.param.user)
    app.param('code', code.param.code)

    app.get('/@:user/:code.jsx', code.get)
    app.post('/@:user/:code.jsx', code.post)
  } (require('./code'))
}