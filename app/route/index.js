var passport = require('../passport')

module.exports = function (app) {
  app.get('/', require('./home'))
  app.get('/login', passport.authenticate('github'), require('./login'))
  app.get('/logout', require('./logout'))
}