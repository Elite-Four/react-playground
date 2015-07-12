var GitHub = require('github')

var github = new GitHub({
  version: "3.0.0",
  debug: process.env.NODE_ENV != 'production',
  headers: {
    "user-agent": "react-playground"
  }
})

exports.getUserId = function (user, callback) {
  github.user.getFrom({
      user: user
    }, function (err, res) {
      return callback(err, res ? res.id : null)
    })
}
