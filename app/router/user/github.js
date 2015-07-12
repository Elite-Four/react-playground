var GitHub = require('github')
var config = require('config')

var auth = config.get('github')

var github = new GitHub({
  version: "3.0.0",
  debug: process.env.NODE_ENV != 'production',
  headers: {
    "user-agent": "react-playground"
  }
})

github.authenticate({
  type: "oauth",
  key: auth.clientID,
  secret: auth.clientSecret
})

exports.getUserId = function (user, callback) {
  github.user.getFrom({
      user: user
    }, function (err, res) {
      return callback(err, res ? res.id : null)
    })
}
